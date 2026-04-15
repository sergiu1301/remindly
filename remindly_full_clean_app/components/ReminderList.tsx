'use client';

type Reminder = {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  dueDate: string;
  notifyBefore: number;
};

export default function ReminderList({ reminders, t }: { reminders: Reminder[], t: any }) {
  async function handleDelete(id: string) {
    const confirmed = confirm('Delete this reminder?');
    if (!confirmed) return;

    await fetch(`/api/reminders/${id}`, {
      method: 'DELETE'
    });

    window.location.reload();
  }

  if (reminders.length === 0) {
    return <div className="emptyState">{t.noReminders}</div>;
  }

  return (
    <div className="reminderList">
      {reminders.map((reminder) => (
        <article className="reminderCard" key={reminder.id}>
          <div className="rowBetween">
            <strong style={{ fontSize: 18 }}>{reminder.title}</strong>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="tag">{reminder.category}</span>
              <span className="tag">
                {new Date(reminder.dueDate).toLocaleDateString()}
              </span>
              <span className="tag">{reminder.notifyBefore}d</span>

              <button
                onClick={() => handleDelete(reminder.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {reminder.description && (
            <div style={{ color: 'var(--muted)' }}>
              {reminder.description}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}