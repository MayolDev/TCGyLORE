import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function FlashMessages() {
    const { flash } = usePage<any>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                duration: 5000,
            });
        }
        if (flash?.warning) {
            toast.warning(flash.warning, {
                duration: 4000,
            });
        }
        if (flash?.info) {
            toast.info(flash.info, {
                duration: 4000,
            });
        }
    }, [flash]);

    return null;
}

