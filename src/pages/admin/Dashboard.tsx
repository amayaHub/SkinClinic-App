import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Settings, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalConfirmed: number;
  totalPending: number;
  totalCancelled: number;
  totalClosed: number;
  dailyStats: {
    date: string;
    confirmed: number;
    cancelled: number;
  }[];
}

export function AdminDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats>({
    totalConfirmed: 0,
    totalPending: 0,
    totalCancelled: 0,
    totalClosed: 0,
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);

        // Fetch appointments for the current month
        const { data: appointments, error } = await supabase
          .from('appointments')
          .select('*')
          .gte('scheduled_for', startDate.toISOString())
          .lte('scheduled_for', endDate.toISOString());

        if (error) throw error;

        // Calculate totals
        const totalConfirmed = appointments?.filter(a => a.status === 'confirmed').length || 0;
        const totalPending = appointments?.filter(a => a.status === 'pending').length || 0;
        const totalCancelled = appointments?.filter(a => a.status === 'cancelled').length || 0;
        const totalClosed = appointments?.filter(a => a.closed === true).length || 0;

        // Calculate daily stats
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const dailyStats = days.map(day => {
          const dayAppointments = appointments?.filter(a => 
            new Date(a.scheduled_for).toDateString() === day.toDateString()
          ) || [];

          return {
            date: format(day, 'yyyy-MM-dd'),
            confirmed: dayAppointments.filter(a => a.status === 'confirmed').length,
            cancelled: dayAppointments.filter(a => a.status === 'cancelled').length
          };
        });

        setStats({
          totalConfirmed,
          totalPending,
          totalCancelled,
          totalClosed,
          dailyStats
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [currentMonth]);

  const chartData = {
    labels: stats.dailyStats.map(stat => 
      format(new Date(stat.date), 'd MMM', { locale: es })
    ),
    datasets: [
      {
        label: 'Citas Confirmadas',
        data: stats.dailyStats.map(stat => stat.confirmed),
        borderColor: 'rgba(34, 197, 94, 0.8)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4
      },
      {
        label: 'Citas Canceladas',
        data: stats.dailyStats.map(stat => stat.cancelled),
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: 'rgba(229, 231, 235, 0.6)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (context: any) => {
            return `${context[0].label}`;
          },
          label: (context: any) => {
            return ` ${context.dataset.label}: ${context.parsed.y} citas`;
          }
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 13
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(243, 244, 246, 0.6)',
          drawBorder: false
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Panel de Administración</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <Link
            to="/admin/services"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-6 w-6 text-rose-300" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-neutral-900">Servicios</h2>
                <p className="mt-1 text-sm text-neutral-600">Gestionar servicios y tratamientos</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/appointments"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-rose-300" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-neutral-900">Citas</h2>
                <p className="mt-1 text-sm text-neutral-600">Ver y gestionar todas las citas</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/clients"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-rose-300" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-neutral-900">Clientes</h2>
                <p className="mt-1 text-sm text-neutral-600">Gestionar perfiles de clientes</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900">Estadísticas</h2>
          <p className="mt-2 text-neutral-600">
            Vista general del rendimiento y métricas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-green-50 rounded-lg shadow-sm p-6">
            <div>
              <h3 className="text-lg font-medium text-green-800">Citas Confirmadas</h3>
              <p className="mt-6 text-5xl font-bold text-green-700">{stats.totalConfirmed}</p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-sm p-6">
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Por Confirmar</h3>
              <p className="mt-6 text-5xl font-bold text-yellow-700">{stats.totalPending}</p>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg shadow-sm p-6">
            <div>
              <h3 className="text-lg font-medium text-red-800">Canceladas</h3>
              <p className="mt-6 text-5xl font-bold text-red-700">{stats.totalCancelled}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-sm p-6">
            <div>
              <h3 className="text-lg font-medium text-blue-800">Cerradas</h3>
              <p className="mt-6 text-5xl font-bold text-blue-700">{stats.totalClosed}</p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-neutral-900">Evolución de Citas</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-neutral-600 min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="w-full aspect-[2/1]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}