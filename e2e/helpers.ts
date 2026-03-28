import { Page } from '@playwright/test';

/** Clear IndexedDB — must be called AFTER navigating to app origin */
export async function clearAppData(page: Page) {
  await page.goto('/');
  await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name) indexedDB.deleteDatabase(db.name);
    }
  });
  await page.reload();
}

/** Skip onboarding by setting placementDone — navigates to app first */
export async function skipOnboarding(page: Page) {
  await page.goto('/');
  // Wait for Dexie to init the DB, then update the profile
  await page.waitForTimeout(500);
  await page.evaluate(async () => {
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.open('WordFlowDB');
      req.onsuccess = () => {
        const db = req.result;
        try {
          const tx = db.transaction('userProfile', 'readwrite');
          const store = tx.objectStore('userProfile');
          const getReq = store.get('default');
          getReq.onsuccess = () => {
            const profile = getReq.result || {
              id: 'default', xp: 0, level: 1, currentStreak: 0, longestStreak: 0,
              lastActiveDate: '', dailyGoal: 10, theme: 'system', badges: [], createdAt: Date.now(),
            };
            profile.placementDone = true;
            profile.placementLevel = 'A1';
            store.put(profile);
            tx.oncomplete = () => { db.close(); resolve(); };
            tx.onerror = () => { db.close(); reject(tx.error); };
          };
        } catch (e) {
          db.close();
          reject(e);
        }
      };
      req.onerror = () => reject(req.error);
    });
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
}
