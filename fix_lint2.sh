#!/bin/bash
sed -i 's/import { TileLayer, //g' resources/js/components/map-view.tsx
sed -i 's/(item, index)/(item)/g' resources/js/layouts/app/app-sidebar-layout.tsx
sed -i 's/(doc, index)/(doc)/g' resources/js/pages/Admin/Manual/Index.tsx
