import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/worlds',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorldController::index
 * @see app/Http/Controllers/Admin/WorldController.php:12
 * @route '/admin/worlds'
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
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/worlds/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorldController::create
 * @see app/Http/Controllers/Admin/WorldController.php:29
 * @route '/admin/worlds/create'
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
* @see \App\Http\Controllers\Admin\WorldController::store
 * @see app/Http/Controllers/Admin/WorldController.php:34
 * @route '/admin/worlds'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/worlds',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::store
 * @see app/Http/Controllers/Admin/WorldController.php:34
 * @route '/admin/worlds'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::store
 * @see app/Http/Controllers/Admin/WorldController.php:34
 * @route '/admin/worlds'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::store
 * @see app/Http/Controllers/Admin/WorldController.php:34
 * @route '/admin/worlds'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::store
 * @see app/Http/Controllers/Admin/WorldController.php:34
 * @route '/admin/worlds'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
export const show = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/worlds/{world}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
show.url = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { world: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    world: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        world: args.world,
                }

    return show.definition.url
            .replace('{world}', parsedArgs.world.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
show.get = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
show.head = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
    const showForm = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
        showForm.get = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorldController::show
 * @see app/Http/Controllers/Admin/WorldController.php:0
 * @route '/admin/worlds/{world}'
 */
        showForm.head = (args: { world: string | number } | [world: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
export const edit = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/worlds/{world}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
edit.url = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { world: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { world: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    world: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        world: typeof args.world === 'object'
                ? args.world.id
                : args.world,
                }

    return edit.definition.url
            .replace('{world}', parsedArgs.world.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
edit.get = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
edit.head = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
    const editForm = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
        editForm.get = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorldController::edit
 * @see app/Http/Controllers/Admin/WorldController.php:49
 * @route '/admin/worlds/{world}/edit'
 */
        editForm.head = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
export const update = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/worlds/{world}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
update.url = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { world: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { world: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    world: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        world: typeof args.world === 'object'
                ? args.world.id
                : args.world,
                }

    return update.definition.url
            .replace('{world}', parsedArgs.world.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
update.put = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
update.patch = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
    const updateForm = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
        updateForm.put = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\WorldController::update
 * @see app/Http/Controllers/Admin/WorldController.php:56
 * @route '/admin/worlds/{world}'
 */
        updateForm.patch = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\WorldController::destroy
 * @see app/Http/Controllers/Admin/WorldController.php:71
 * @route '/admin/worlds/{world}'
 */
export const destroy = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/worlds/{world}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\WorldController::destroy
 * @see app/Http/Controllers/Admin/WorldController.php:71
 * @route '/admin/worlds/{world}'
 */
destroy.url = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { world: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { world: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    world: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        world: typeof args.world === 'object'
                ? args.world.id
                : args.world,
                }

    return destroy.definition.url
            .replace('{world}', parsedArgs.world.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorldController::destroy
 * @see app/Http/Controllers/Admin/WorldController.php:71
 * @route '/admin/worlds/{world}'
 */
destroy.delete = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\WorldController::destroy
 * @see app/Http/Controllers/Admin/WorldController.php:71
 * @route '/admin/worlds/{world}'
 */
    const destroyForm = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorldController::destroy
 * @see app/Http/Controllers/Admin/WorldController.php:71
 * @route '/admin/worlds/{world}'
 */
        destroyForm.delete = (args: { world: number | { id: number } } | [world: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const WorldController = { index, create, store, show, edit, update, destroy }

export default WorldController