import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Role[];
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/users',
    },
    {
        title: 'Usuarios',
        href: '/admin/users',
    },
];

export default function Index({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true });
    };

    const handleDelete = (userId: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            router.delete(`/admin/users/${userId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                        <p className="text-muted-foreground">
                            Administra los usuarios del sistema
                        </p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Nuevo Usuario
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border bg-card">
                    <div className="p-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button type="submit" variant="secondary">
                                <Search className="mr-2 size-4" />
                                Buscar
                            </Button>
                            {filters.search && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setSearch('');
                                        router.get('/admin/users');
                                    }}
                                >
                                    Limpiar
                                </Button>
                            )}
                        </form>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Fecha de Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No se encontraron usuarios
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant={
                                                            role.name === 'Admin'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t p-4">
                            <div className="text-sm text-muted-foreground">
                                Mostrando {users.data.length} de {users.total} usuarios
                            </div>
                            <div className="flex gap-2">
                                {users.current_page > 1 && (
                                    <Link
                                        href={`/admin/users?page=${users.current_page - 1}${
                                            search ? `&search=${search}` : ''
                                        }`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Anterior
                                        </Button>
                                    </Link>
                                )}
                                {users.current_page < users.last_page && (
                                    <Link
                                        href={`/admin/users?page=${users.current_page + 1}${
                                            search ? `&search=${search}` : ''
                                        }`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Siguiente
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

