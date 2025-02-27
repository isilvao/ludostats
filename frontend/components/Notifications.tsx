'use client';
import { useEffect, useState } from 'react';
import { BellRing, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaBell } from 'react-icons/fa';
import { TeamsAPI } from '@/api/teams';

const Notifications = () => {
  interface Notification {
    id: string;
    mensaje: string;
    fecha_creacion: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const api = new TeamsAPI();
        const data = await api.obtenerNotificaciones(
          'da69d930-ac88-49e9-a3c0-aabf1f1b3f4a'
        );
        const unreadNotifications = data.noLeidas;
        setNotifications(unreadNotifications);
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const api = new TeamsAPI();
      await Promise.all(
        notifications.map((notification) =>
          api.marcarNotificacionLeida(notification.id)
        )
      );
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <FaBell
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          size={24}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red rounded-full">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[380px] p-0">
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Tienes {unreadCount} notificaciones sin leer.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.mensaje}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.fecha_creacion).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={markAllAsRead}>
              <Check /> Marcar todas como leidas
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
