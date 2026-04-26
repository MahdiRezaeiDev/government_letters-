import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/positions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PositionController::index
 * @see app/Http/Controllers/PositionController.php:23
 * @route '/positions'
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
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/positions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PositionController::create
 * @see app/Http/Controllers/PositionController.php:72
 * @route '/positions/create'
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
* @see \App\Http\Controllers\PositionController::store
 * @see app/Http/Controllers/PositionController.php:96
 * @route '/positions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/positions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PositionController::store
 * @see app/Http/Controllers/PositionController.php:96
 * @route '/positions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::store
 * @see app/Http/Controllers/PositionController.php:96
 * @route '/positions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PositionController::store
 * @see app/Http/Controllers/PositionController.php:96
 * @route '/positions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PositionController::store
 * @see app/Http/Controllers/PositionController.php:96
 * @route '/positions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
export const show = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/positions/{position}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
show.url = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { position: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { position: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    position: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        position: typeof args.position === 'object'
                ? args.position.id
                : args.position,
                }

    return show.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
show.get = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
show.head = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
    const showForm = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
        showForm.get = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PositionController::show
 * @see app/Http/Controllers/PositionController.php:150
 * @route '/positions/{position}'
 */
        showForm.head = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
export const edit = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/positions/{position}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
edit.url = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { position: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { position: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    position: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        position: typeof args.position === 'object'
                ? args.position.id
                : args.position,
                }

    return edit.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
edit.get = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
edit.head = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
    const editForm = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
        editForm.get = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PositionController::edit
 * @see app/Http/Controllers/PositionController.php:184
 * @route '/positions/{position}/edit'
 */
        editForm.head = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
export const update = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/positions/{position}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
update.url = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { position: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { position: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    position: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        position: typeof args.position === 'object'
                ? args.position.id
                : args.position,
                }

    return update.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
update.put = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
update.patch = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
    const updateForm = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
        updateForm.put = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\PositionController::update
 * @see app/Http/Controllers/PositionController.php:211
 * @route '/positions/{position}'
 */
        updateForm.patch = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PositionController::destroy
 * @see app/Http/Controllers/PositionController.php:263
 * @route '/positions/{position}'
 */
export const destroy = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/positions/{position}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PositionController::destroy
 * @see app/Http/Controllers/PositionController.php:263
 * @route '/positions/{position}'
 */
destroy.url = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { position: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { position: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    position: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        position: typeof args.position === 'object'
                ? args.position.id
                : args.position,
                }

    return destroy.definition.url
            .replace('{position}', parsedArgs.position.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::destroy
 * @see app/Http/Controllers/PositionController.php:263
 * @route '/positions/{position}'
 */
destroy.delete = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PositionController::destroy
 * @see app/Http/Controllers/PositionController.php:263
 * @route '/positions/{position}'
 */
    const destroyForm = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PositionController::destroy
 * @see app/Http/Controllers/PositionController.php:263
 * @route '/positions/{position}'
 */
        destroyForm.delete = (args: { position: number | { id: number } } | [position: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
export const getList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getList.url(options),
    method: 'get',
})

getList.definition = {
    methods: ["get","head"],
    url: '/positions-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
getList.url = (options?: RouteQueryOptions) => {
    return getList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
getList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
getList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getList.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
    const getListForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getList.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
        getListForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getList.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PositionController::getList
 * @see app/Http/Controllers/PositionController.php:295
 * @route '/positions-list'
 */
        getListForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getList.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getList.form = getListForm
/**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
export const getManagementList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getManagementList.url(options),
    method: 'get',
})

getManagementList.definition = {
    methods: ["get","head"],
    url: '/positions-management-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
getManagementList.url = (options?: RouteQueryOptions) => {
    return getManagementList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
getManagementList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getManagementList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
getManagementList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getManagementList.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
    const getManagementListForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getManagementList.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
        getManagementListForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getManagementList.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PositionController::getManagementList
 * @see app/Http/Controllers/PositionController.php:324
 * @route '/positions-management-list'
 */
        getManagementListForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getManagementList.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getManagementList.form = getManagementListForm
const PositionController = { index, create, store, show, edit, update, destroy, getList, getManagementList }

export default PositionController