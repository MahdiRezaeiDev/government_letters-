import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:17
 * @route '/admin/organizations'
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
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/organizations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:45
 * @route '/admin/organizations/create'
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
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:53
 * @route '/admin/organizations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/organizations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:53
 * @route '/admin/organizations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:53
 * @route '/admin/organizations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:53
 * @route '/admin/organizations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:53
 * @route '/admin/organizations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
export const show = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/organizations/{organization}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
show.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return show.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
show.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
show.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
    const showForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
        showForm.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/admin/organizations/{organization}'
 */
        showForm.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
export const edit = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/organizations/{organization}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
edit.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return edit.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
edit.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
edit.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
    const editForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
        editForm.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:120
 * @route '/admin/organizations/{organization}/edit'
 */
        editForm.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
export const update = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/organizations/{organization}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
update.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
update.put = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
update.patch = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
    const updateForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
        updateForm.put = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:134
 * @route '/admin/organizations/{organization}'
 */
        updateForm.patch = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:187
 * @route '/admin/organizations/{organization}'
 */
export const destroy = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/organizations/{organization}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:187
 * @route '/admin/organizations/{organization}'
 */
destroy.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:187
 * @route '/admin/organizations/{organization}'
 */
destroy.delete = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:187
 * @route '/admin/organizations/{organization}'
 */
    const destroyForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:187
 * @route '/admin/organizations/{organization}'
 */
        destroyForm.delete = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrganizationController::toggleStatus
 * @see app/Http/Controllers/OrganizationController.php:216
 * @route '/admin/organizations/{organization}/toggle-status'
 */
export const toggleStatus = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/organizations/{organization}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::toggleStatus
 * @see app/Http/Controllers/OrganizationController.php:216
 * @route '/admin/organizations/{organization}/toggle-status'
 */
toggleStatus.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return toggleStatus.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::toggleStatus
 * @see app/Http/Controllers/OrganizationController.php:216
 * @route '/admin/organizations/{organization}/toggle-status'
 */
toggleStatus.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::toggleStatus
 * @see app/Http/Controllers/OrganizationController.php:216
 * @route '/admin/organizations/{organization}/toggle-status'
 */
    const toggleStatusForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::toggleStatus
 * @see app/Http/Controllers/OrganizationController.php:216
 * @route '/admin/organizations/{organization}/toggle-status'
 */
        toggleStatusForm.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
 */
export const getList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getList.url(options),
    method: 'get',
})

getList.definition = {
    methods: ["get","head"],
    url: '/admin/organizations-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
 */
getList.url = (options?: RouteQueryOptions) => {
    return getList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
 */
getList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
 */
getList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getList.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
 */
    const getListForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getList.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
 */
        getListForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getList.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::getList
 * @see app/Http/Controllers/OrganizationController.php:227
 * @route '/admin/organizations-list'
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
const OrganizationController = { index, create, store, show, edit, update, destroy, toggleStatus, getList }

export default OrganizationController