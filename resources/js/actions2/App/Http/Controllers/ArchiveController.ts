import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/archives',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveController::index
 * @see app/Http/Controllers/ArchiveController.php:19
 * @route '/archives'
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
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/archives/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveController::create
 * @see app/Http/Controllers/ArchiveController.php:73
 * @route '/archives/create'
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
* @see \App\Http\Controllers\ArchiveController::store
 * @see app/Http/Controllers/ArchiveController.php:103
 * @route '/archives'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/archives',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArchiveController::store
 * @see app/Http/Controllers/ArchiveController.php:103
 * @route '/archives'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::store
 * @see app/Http/Controllers/ArchiveController.php:103
 * @route '/archives'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ArchiveController::store
 * @see app/Http/Controllers/ArchiveController.php:103
 * @route '/archives'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::store
 * @see app/Http/Controllers/ArchiveController.php:103
 * @route '/archives'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
export const show = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
show.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { archive: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { archive: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                }

    return show.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
show.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
show.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
    const showForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
        showForm.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveController::show
 * @see app/Http/Controllers/ArchiveController.php:153
 * @route '/archives/{archive}'
 */
        showForm.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
export const edit = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
edit.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { archive: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { archive: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                }

    return edit.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
edit.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
edit.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
    const editForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
        editForm.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveController::edit
 * @see app/Http/Controllers/ArchiveController.php:180
 * @route '/archives/{archive}/edit'
 */
        editForm.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
export const update = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/archives/{archive}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
update.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { archive: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { archive: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                }

    return update.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
update.put = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
update.patch = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
    const updateForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
        updateForm.put = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ArchiveController::update
 * @see app/Http/Controllers/ArchiveController.php:211
 * @route '/archives/{archive}'
 */
        updateForm.patch = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ArchiveController::destroy
 * @see app/Http/Controllers/ArchiveController.php:250
 * @route '/archives/{archive}'
 */
export const destroy = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/archives/{archive}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ArchiveController::destroy
 * @see app/Http/Controllers/ArchiveController.php:250
 * @route '/archives/{archive}'
 */
destroy.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { archive: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { archive: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                }

    return destroy.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::destroy
 * @see app/Http/Controllers/ArchiveController.php:250
 * @route '/archives/{archive}'
 */
destroy.delete = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ArchiveController::destroy
 * @see app/Http/Controllers/ArchiveController.php:250
 * @route '/archives/{archive}'
 */
    const destroyForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::destroy
 * @see app/Http/Controllers/ArchiveController.php:250
 * @route '/archives/{archive}'
 */
        destroyForm.delete = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
export const permissions = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(args, options),
    method: 'get',
})

permissions.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
permissions.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { archive: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { archive: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                }

    return permissions.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
permissions.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
permissions.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permissions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
    const permissionsForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: permissions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
        permissionsForm.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ArchiveController::permissions
 * @see app/Http/Controllers/ArchiveController.php:272
 * @route '/archives/{archive}/permissions'
 */
        permissionsForm.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    permissions.form = permissionsForm
const ArchiveController = { index, create, store, show, edit, update, destroy, permissions }

export default ArchiveController