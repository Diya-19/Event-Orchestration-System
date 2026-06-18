import { useState, useEffect } from "react";
import { Bell, Calendar, Clock, Loader2, Check } from "lucide-react";
import { api } from "../../lib/api";
import TravelTabs from "./TravelTabs";

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  notification_type: string;
  deadline?: string;
  action_label?: string;
  action_url?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

interface ScheduleItem {
  date: string;
  time: string;
  event: string;
}

const getRelativeTime = (dateStr?: string) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return `${diffDays} days left`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notifRes, scheduleRes] = await Promise.all([
          api.get("/api/participant/notifications"),
          api.get("/api/participant/travel/schedule")
        ]);
        setNotifications(notifRes.data || []);
        setSchedule(scheduleRes.data.schedule || []);
        console.log("Notifications API response:", notifRes.data);
        console.log("Notifications state:", notifRes.data || []);
      } catch (err: any) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const markAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await api.patch(`/api/participant/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Generate dynamic categories for filters
  const categories = ["All", ...Array.from(new Set(notifications.map(n => n.category)))];

  // Filter logic
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    return n.category === activeFilter;
  });

  console.log("Filtered notifications:", filteredNotifications);

  return (
    <div className="p-8 space-y-8">
      <TravelTabs />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with important announcements from the organizing committee.</p>
      </div>

      {/* Filters */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                activeFilter === filter 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Notifications Yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">The committee has not posted any updates. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const relativeTime = getRelativeTime(notif.deadline);
            const formattedDate = formatDate(notif.deadline);
            
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id, notif.is_read)}
                className={`rounded-xl p-5 border cursor-pointer transition-all flex justify-between items-start gap-4 ${
                  !notif.is_read 
                    ? "bg-purple-50 border-purple-200 shadow-sm" 
                    : "bg-white border-gray-200 hover:shadow-md hover:border-purple-300"
                }`}
              >
                {/* Left Side */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {notif.title}
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                </div>
                
                {/* Right Side */}
                <div className="text-right flex flex-col items-end flex-shrink-0">
                  {relativeTime && <p className="text-sm font-semibold text-purple-700 mb-0.5">{relativeTime}</p>}
                  {formattedDate && <p className="text-xs text-gray-500">{formattedDate}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming Travel Schedule */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Calendar className="text-orange-600" size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Upcoming Travel Schedule</h3>
        </div>
        
        {schedule.length === 0 ? (
          <p className="text-gray-500 text-sm pl-4 border-l-2 border-transparent">No upcoming travel events available.</p>
        ) : (
          <div className="relative border-l-2 border-orange-100 ml-4 space-y-6 mt-1">
            {schedule.map((item, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center ring-4 ring-white">
                  <Clock className="text-orange-600" size={12} />
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-16 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{item.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    {item.time && <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}