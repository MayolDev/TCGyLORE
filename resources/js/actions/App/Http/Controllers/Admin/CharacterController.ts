import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/characters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CharacterController::index
 * @see app/Http/Controllers/Admin/CharacterController.php:15
 * @route '/admin/characters'
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
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/characters/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CharacterController::create
 * @see app/Http/Controllers/Admin/CharacterController.php:40
 * @route '/admin/characters/create'
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
* @see \App\Http\Controllers\Admin\CharacterController::store
 * @see app/Http/Controllers/Admin/CharacterController.php:49
 * @route '/admin/characters'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/characters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::store
 * @see app/Http/Controllers/Admin/CharacterController.php:49
 * @route '/admin/characters'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::store
 * @see app/Http/Controllers/Admin/CharacterController.php:49
 * @route '/admin/characters'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::store
 * @see app/Http/Controllers/Admin/CharacterController.php:49
 * @route '/admin/characters'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::store
 * @see app/Http/Controllers/Admin/CharacterController.php:49
 * @route '/admin/characters'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
export const show = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/characters/{character}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
show.url = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { character: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    character: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        character: args.character,
                }

    return show.definition.url
            .replace('{character}', parsedArgs.character.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
show.get = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
show.head = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
    const showForm = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
        showForm.get = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CharacterController::show
 * @see app/Http/Controllers/Admin/CharacterController.php:0
 * @route '/admin/characters/{character}'
 */
        showForm.head = (args: { character: string | number } | [character: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
export const edit = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/characters/{character}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
edit.url = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { character: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { character: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    character: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        character: typeof args.character === 'object'
                ? args.character.id
                : args.character,
                }

    return edit.definition.url
            .replace('{character}', parsedArgs.character.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
edit.get = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
edit.head = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
    const editForm = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
        editForm.get = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CharacterController::edit
 * @see app/Http/Controllers/Admin/CharacterController.php:77
 * @route '/admin/characters/{character}/edit'
 */
        editForm.head = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
export const update = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/characters/{character}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
update.url = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { character: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { character: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    character: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        character: typeof args.character === 'object'
                ? args.character.id
                : args.character,
                }

    return update.definition.url
            .replace('{character}', parsedArgs.character.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
update.put = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
update.patch = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
    const updateForm = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
        updateForm.put = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\CharacterController::update
 * @see app/Http/Controllers/Admin/CharacterController.php:89
 * @route '/admin/characters/{character}'
 */
        updateForm.patch = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CharacterController::destroy
 * @see app/Http/Controllers/Admin/CharacterController.php:121
 * @route '/admin/characters/{character}'
 */
export const destroy = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/characters/{character}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CharacterController::destroy
 * @see app/Http/Controllers/Admin/CharacterController.php:121
 * @route '/admin/characters/{character}'
 */
destroy.url = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { character: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { character: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    character: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        character: typeof args.character === 'object'
                ? args.character.id
                : args.character,
                }

    return destroy.definition.url
            .replace('{character}', parsedArgs.character.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CharacterController::destroy
 * @see app/Http/Controllers/Admin/CharacterController.php:121
 * @route '/admin/characters/{character}'
 */
destroy.delete = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CharacterController::destroy
 * @see app/Http/Controllers/Admin/CharacterController.php:121
 * @route '/admin/characters/{character}'
 */
    const destroyForm = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CharacterController::destroy
 * @see app/Http/Controllers/Admin/CharacterController.php:121
 * @route '/admin/characters/{character}'
 */
        destroyForm.delete = (args: { character: number | { id: number } } | [character: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CharacterController = { index, create, store, show, edit, update, destroy }

export default CharacterController