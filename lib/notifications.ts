import { LocalNotifications } from '@capacitor/local-notifications';

export async function requestNotificationPermission() {
  if (typeof window !== 'undefined') {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  }
  return false;
}

export async function scheduleDailyReminder() {
  if (typeof window === 'undefined') return;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  // Clear existing daily reminders
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Your Quests Await! ⚔️",
        body: "Don't break your streak! Your daily training is waiting to be conquered.",
        id: 1,
        schedule: {
          allowWhileIdle: true,
          on: { hour: 10, minute: 0 } // Everyday at 10 AM
        },
      }
    ]
  });
}

export async function sendLevelUpNotification(newLevel: number, newRank: string) {
  if (typeof window === 'undefined') return;
  
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const catchyPhrases = [
    "Your power is surging! ⚡",
    "A breakthrough in your stats! 💥",
    "The System acknowledges your growth. 🏆",
    "You're becoming unstoppable! 🔥"
  ];
  
  const randomPhrase = catchyPhrases[Math.floor(Math.random() * catchyPhrases.length)];

  await LocalNotifications.schedule({
    notifications: [
      {
        title: `LEVEL UP! ${randomPhrase}`,
        body: `You are now Level ${newLevel} (Rank ${newRank}). Review your new stats!`,
        id: Date.now(), // Unique ID for instant notification
        schedule: { at: new Date(Date.now() + 1000) } // Schedule 1 second from now
      }
    ]
  });
}
