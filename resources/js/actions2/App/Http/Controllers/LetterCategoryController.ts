import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
 */
export const getList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getList.url(options),
    method: 'get',
})

getList.definition = {
    methods: ["get","head"],
    url: '/categories-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
 */
getList.url = (options?: RouteQueryOptions) => {
    return getList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
 */
getList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
 */
getList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getList.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
 */
    const getListForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getList.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
 */
        getListForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getList.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterCategoryController::getList
 * @see app/Http/Controllers/LetterCategoryController.php:286
 * @route '/categories-list'
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
* @see \App\Http\Controllers\LetterCategoryController::toggleStatus
 * @see app/Http/Controllers/LetterCategoryController.php:270
 * @route '/categories/{category}/toggle-status'
 */
export const toggleStatus = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/categories/{category}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::toggleStatus
 * @see app/Http/Controllers/LetterCategoryController.php:270
 * @route '/categories/{category}/toggle-status'
 */
toggleStatus.url = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: typeof args.category === 'object'
                ? args.category.id
                : args.category,
                }

    return toggleStatus.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::toggleStatus
 * @see app/Http/Controllers/LetterCategoryController.php:270
 * @route '/categories/{category}/toggle-status'
 */
toggleStatus.post = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::toggleStatus
 * @see app/Http/Controllers/LetterCategoryController.php:270
 * @route '/categories/{category}/toggle-status'
 */
    const toggleStatusForm = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::toggleStatus
 * @see app/Http/Controllers/LetterCategoryController.php:270
 * @route '/categories/{category}/toggle-status'
 */
        toggleStatusForm.post = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterCategoryController::index
 * @see app/Http/Controllers/LetterCategoryController.php:16
 * @route '/categories'
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
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/categories/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterCategoryController::create
 * @see app/Http/Controllers/LetterCategoryController.php:66
 * @route '/categories/create'
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
* @see \App\Http\Controllers\LetterCategoryController::store
 * @see app/Http/Controllers/LetterCategoryController.php:97
 * @route '/categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::store
 * @see app/Http/Controllers/LetterCategoryController.php:97
 * @route '/categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::store
 * @see app/Http/Controllers/LetterCategoryController.php:97
 * @route '/categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::store
 * @see app/Http/Controllers/LetterCategoryController.php:97
 * @route '/categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::store
 * @see app/Http/Controllers/LetterCategoryController.php:97
 * @route '/categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
export const show = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
show.url = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: typeof args.category === 'object'
                ? args.category.id
                : args.category,
                }

    return show.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
show.get = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
show.head = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
    const showForm = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
        showForm.get = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterCategoryController::show
 * @see app/Http/Controllers/LetterCategoryController.php:139
 * @route '/categories/{category}'
 */
        showForm.head = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
export const edit = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/categories/{category}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
edit.url = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: typeof args.category === 'object'
                ? args.category.id
                : args.category,
                }

    return edit.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
edit.get = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
edit.head = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
    const editForm = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
        editForm.get = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterCategoryController::edit
 * @see app/Http/Controllers/LetterCategoryController.php:171
 * @route '/categories/{category}/edit'
 */
        editForm.head = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
export const update = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
update.url = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: typeof args.category === 'object'
                ? args.category.id
                : args.category,
                }

    return update.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
update.put = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
update.patch = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
    const updateForm = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
        updateForm.put = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\LetterCategoryController::update
 * @see app/Http/Controllers/LetterCategoryController.php:202
 * @route '/categories/{category}'
 */
        updateForm.patch = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LetterCategoryController::destroy
 * @see app/Http/Controllers/LetterCategoryController.php:243
 * @route '/categories/{category}'
 */
export const destroy = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LetterCategoryController::destroy
 * @see app/Http/Controllers/LetterCategoryController.php:243
 * @route '/categories/{category}'
 */
destroy.url = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { category: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: typeof args.category === 'object'
                ? args.category.id
                : args.category,
                }

    return destroy.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterCategoryController::destroy
 * @see app/Http/Controllers/LetterCategoryController.php:243
 * @route '/categories/{category}'
 */
destroy.delete = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LetterCategoryController::destroy
 * @see app/Http/Controllers/LetterCategoryController.php:243
 * @route '/categories/{category}'
 */
    const destroyForm = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterCategoryController::destroy
 * @see app/Http/Controllers/LetterCategoryController.php:243
 * @route '/categories/{category}'
 */
        destroyForm.delete = (args: { category: number | { id: number } } | [category: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LetterCategoryController = { getList, toggleStatus, index, create, store, show, edit, update, destroy }

export default LetterCategoryController