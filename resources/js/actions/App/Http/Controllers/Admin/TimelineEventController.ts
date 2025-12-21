import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/timeline-events',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::index
 * @see app/Http/Controllers/Admin/TimelineEventController.php:15
 * @route '/admin/timeline-events'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/timeline-events/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::create
 * @see app/Http/Controllers/Admin/TimelineEventController.php:39
 * @route '/admin/timeline-events/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::store
 * @see app/Http/Controllers/Admin/TimelineEventController.php:48
 * @route '/admin/timeline-events'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/timeline-events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::store
 * @see app/Http/Controllers/Admin/TimelineEventController.php:48
 * @route '/admin/timeline-events'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::store
 * @see app/Http/Controllers/Admin/TimelineEventController.php:48
 * @route '/admin/timeline-events'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::store
 * @see app/Http/Controllers/Admin/TimelineEventController.php:48
 * @route '/admin/timeline-events'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::store
 * @see app/Http/Controllers/Admin/TimelineEventController.php:48
 * @route '/admin/timeline-events'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
export const show = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/timeline-events/{timeline_event}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
show.url = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeline_event: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timeline_event: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timeline_event: args.timeline_event,
                }

    return show.definition.url
            .replace('{timeline_event}', parsedArgs.timeline_event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
show.get = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
show.head = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
    const showForm = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
        showForm.get = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::show
 * @see app/Http/Controllers/Admin/TimelineEventController.php:0
 * @route '/admin/timeline-events/{timeline_event}'
 */
        showForm.head = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
export const edit = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/timeline-events/{timeline_event}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
edit.url = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeline_event: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timeline_event: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timeline_event: args.timeline_event,
                }

    return edit.definition.url
            .replace('{timeline_event}', parsedArgs.timeline_event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
edit.get = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
edit.head = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
    const editForm = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
        editForm.get = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::edit
 * @see app/Http/Controllers/Admin/TimelineEventController.php:77
 * @route '/admin/timeline-events/{timeline_event}/edit'
 */
        editForm.head = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
export const update = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/timeline-events/{timeline_event}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
update.url = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeline_event: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timeline_event: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timeline_event: args.timeline_event,
                }

    return update.definition.url
            .replace('{timeline_event}', parsedArgs.timeline_event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
update.put = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
update.patch = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
    const updateForm = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
        updateForm.put = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::update
 * @see app/Http/Controllers/Admin/TimelineEventController.php:89
 * @route '/admin/timeline-events/{timeline_event}'
 */
        updateForm.patch = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\TimelineEventController::destroy
 * @see app/Http/Controllers/Admin/TimelineEventController.php:118
 * @route '/admin/timeline-events/{timeline_event}'
 */
export const destroy = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/timeline-events/{timeline_event}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::destroy
 * @see app/Http/Controllers/Admin/TimelineEventController.php:118
 * @route '/admin/timeline-events/{timeline_event}'
 */
destroy.url = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timeline_event: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timeline_event: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timeline_event: args.timeline_event,
                }

    return destroy.definition.url
            .replace('{timeline_event}', parsedArgs.timeline_event.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TimelineEventController::destroy
 * @see app/Http/Controllers/Admin/TimelineEventController.php:118
 * @route '/admin/timeline-events/{timeline_event}'
 */
destroy.delete = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\TimelineEventController::destroy
 * @see app/Http/Controllers/Admin/TimelineEventController.php:118
 * @route '/admin/timeline-events/{timeline_event}'
 */
    const destroyForm = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TimelineEventController::destroy
 * @see app/Http/Controllers/Admin/TimelineEventController.php:118
 * @route '/admin/timeline-events/{timeline_event}'
 */
        destroyForm.delete = (args: { timeline_event: string | number } | [timeline_event: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const TimelineEventController = { index, create, store, show, edit, update, destroy }

export default TimelineEventController