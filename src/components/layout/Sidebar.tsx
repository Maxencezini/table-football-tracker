'use client';

import { Home, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/img/depositphotos_346408626-stock-illustration-vector-red-player-table-football.jpg';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Joueurs', href: '/players', icon: Users },
  { name: 'Classement', href: '/ranking', icon: Award },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen sticky top-0 flex flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <div className="flex h-16 shrink-0 items-center justify-center">
        <div className="relative w-12 h-12">
          <Image
            className="rounded-full object-cover"
            src={logo}
            alt="Logo"
            fill
            sizes="(max-width: 48px) 100vw"
            priority
          />
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                        ${
                          isActive
                            ? 'bg-gray-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
} 