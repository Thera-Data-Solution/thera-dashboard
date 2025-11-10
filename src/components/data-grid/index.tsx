"use client";

import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import React, { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { KepsDataView } from "./dataView";

type ActionButton<T> = {
    key: string;
    label: string;
    action: (row: T) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "info" | "success" | "warning";
};

type HelpButton = {
    key: string;
    label: string;
    action?: () => void;
    icon?: React.ReactNode;
    component?: React.ReactNode; // Tambahkan properti `component`
};

export type Column<T, K extends keyof T = keyof T> = {
    key: K;
    label: string;
    render?: (value: T[K] | null | undefined, row: T) => React.ReactNode;
};

interface DataEntityPageProps<T extends { id: string }> {
    title: string;
    caption?: string;
    data: T[];
    columns: Column<T>[];
    titleKey?: keyof T;
    descriptionKeys?: (keyof T)[];
    imageKeys?: keyof T;
    actionButtons?: ActionButton<T>[];
    imageType?: 'avatar' | 'banner';
    helpButton?: HelpButton[];
}

export function KepsDataEntry<T extends { id: string }>({
    title,
    caption,
    data,
    columns,
    titleKey,
    descriptionKeys,
    actionButtons,
    imageKeys,
    imageType,
    helpButton,
}: DataEntityPageProps<T>) {
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-5 font-sans">{title}</h1>
            {helpButton && (
                <div className="mb-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'><ChevronDown className='w-4 h-4' /> Option</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-66'>
                            <DropdownMenuGroup>
                                {helpButton.map((btn) => (
                                    <DropdownMenuItem
                                        key={btn.key}
                                        onClick={btn.action}
                                    >
                                        {/* Render komponen jika ada, jika tidak, render label dan ikon */}
                                        {btn.component ? (
                                            btn.component
                                        ) : (
                                            <>
                                                <Fragment>
                                                    {btn.icon}
                                                </Fragment>
                                                {btn.label}
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            <Separator className="mb-5" />
            <KepsDataView<T>
                caption={caption ?? null}
                data={data}
                columns={columns}
                titleKey={titleKey}
                descriptionKeys={descriptionKeys}
                actionButtons={actionButtons}
                imageKeys={imageKeys}
                imageType={imageType}
            />
        </div>
    );
}