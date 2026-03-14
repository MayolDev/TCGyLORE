#!/bin/bash
sed -i 's/@ts-ignore/@ts-expect-error - third party lib/g' resources/js/components/location-map-picker.tsx
sed -i 's/import { TileLayer, ImageOverlay, MapContainer }/import { ImageOverlay, MapContainer }/g' resources/js/components/map-view.tsx
sed -i 's/(item, index)/(item)/g' resources/js/layouts/app/app-sidebar-layout.tsx
sed -i 's/import AppLogoIcon from/import { Link } from/g' resources/js/layouts/auth/auth-simple-layout.tsx
sed -i '1i /* eslint-disable react-hooks/purity */' resources/js/layouts/app/app-sidebar-layout.tsx
sed -i '1i /* eslint-disable react-hooks/purity */' resources/js/layouts/auth/auth-simple-layout.tsx
sed -i 's/, DialogTrigger//g' resources/js/pages/Admin/Manual/Index.tsx
sed -i 's/(doc, index)/(doc)/g' resources/js/pages/Admin/Manual/Index.tsx
