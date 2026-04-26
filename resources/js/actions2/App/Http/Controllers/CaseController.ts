import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
export const index = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}/cases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
index.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
index.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
index.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
    const indexForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
        indexForm.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CaseController::index
 * @see app/Http/Controllers/CaseController.php:23
 * @route '/archives/{archive}/cases'
 */
        indexForm.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
export const create = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}/cases/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
create.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
create.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
create.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
    const createForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
        createForm.get = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CaseController::create
 * @see app/Http/Controllers/CaseController.php:62
 * @route '/archives/{archive}/cases/create'
 */
        createForm.head = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\CaseController::store
 * @see app/Http/Controllers/CaseController.php:78
 * @route '/archives/{archive}/cases'
 */
export const store = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/archives/{archive}/cases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CaseController::store
 * @see app/Http/Controllers/CaseController.php:78
 * @route '/archives/{archive}/cases'
 */
store.url = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::store
 * @see app/Http/Controllers/CaseController.php:78
 * @route '/archives/{archive}/cases'
 */
store.post = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CaseController::store
 * @see app/Http/Controllers/CaseController.php:78
 * @route '/archives/{archive}/cases'
 */
    const storeForm = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CaseController::store
 * @see app/Http/Controllers/CaseController.php:78
 * @route '/archives/{archive}/cases'
 */
        storeForm.post = (args: { archive: number | { id: number } } | [archive: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
export const show = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}/cases/{case}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
show.url = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                    case: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                                case: typeof args.case === 'object'
                ? args.case.id
                : args.case,
                }

    return show.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace('{case}', parsedArgs.case.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
show.get = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
show.head = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
    const showForm = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
        showForm.get = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CaseController::show
 * @see app/Http/Controllers/CaseController.php:118
 * @route '/archives/{archive}/cases/{case}'
 */
        showForm.head = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
export const edit = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/archives/{archive}/cases/{case}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
edit.url = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                    case: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                                case: typeof args.case === 'object'
                ? args.case.id
                : args.case,
                }

    return edit.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace('{case}', parsedArgs.case.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
edit.get = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
edit.head = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
    const editForm = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
        editForm.get = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CaseController::edit
 * @see app/Http/Controllers/CaseController.php:146
 * @route '/archives/{archive}/cases/{case}/edit'
 */
        editForm.head = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
export const update = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/archives/{archive}/cases/{case}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
update.url = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                    case: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                                case: typeof args.case === 'object'
                ? args.case.id
                : args.case,
                }

    return update.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace('{case}', parsedArgs.case.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
update.put = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
update.patch = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
    const updateForm = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
        updateForm.put = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CaseController::update
 * @see app/Http/Controllers/CaseController.php:163
 * @route '/archives/{archive}/cases/{case}'
 */
        updateForm.patch = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CaseController::destroy
 * @see app/Http/Controllers/CaseController.php:256
 * @route '/archives/{archive}/cases/{case}'
 */
export const destroy = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/archives/{archive}/cases/{case}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CaseController::destroy
 * @see app/Http/Controllers/CaseController.php:256
 * @route '/archives/{archive}/cases/{case}'
 */
destroy.url = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                    case: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                                case: typeof args.case === 'object'
                ? args.case.id
                : args.case,
                }

    return destroy.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace('{case}', parsedArgs.case.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::destroy
 * @see app/Http/Controllers/CaseController.php:256
 * @route '/archives/{archive}/cases/{case}'
 */
destroy.delete = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CaseController::destroy
 * @see app/Http/Controllers/CaseController.php:256
 * @route '/archives/{archive}/cases/{case}'
 */
    const destroyForm = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CaseController::destroy
 * @see app/Http/Controllers/CaseController.php:256
 * @route '/archives/{archive}/cases/{case}'
 */
        destroyForm.delete = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CaseController::attachLetter
 * @see app/Http/Controllers/CaseController.php:202
 * @route '/archives/{archive}/cases/{case}/attach-letter'
 */
export const attachLetter = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attachLetter.url(args, options),
    method: 'post',
})

attachLetter.definition = {
    methods: ["post"],
    url: '/archives/{archive}/cases/{case}/attach-letter',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CaseController::attachLetter
 * @see app/Http/Controllers/CaseController.php:202
 * @route '/archives/{archive}/cases/{case}/attach-letter'
 */
attachLetter.url = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                    case: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                                case: typeof args.case === 'object'
                ? args.case.id
                : args.case,
                }

    return attachLetter.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace('{case}', parsedArgs.case.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::attachLetter
 * @see app/Http/Controllers/CaseController.php:202
 * @route '/archives/{archive}/cases/{case}/attach-letter'
 */
attachLetter.post = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attachLetter.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CaseController::attachLetter
 * @see app/Http/Controllers/CaseController.php:202
 * @route '/archives/{archive}/cases/{case}/attach-letter'
 */
    const attachLetterForm = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: attachLetter.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CaseController::attachLetter
 * @see app/Http/Controllers/CaseController.php:202
 * @route '/archives/{archive}/cases/{case}/attach-letter'
 */
        attachLetterForm.post = (args: { archive: number | { id: number }, case: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: attachLetter.url(args, options),
            method: 'post',
        })
    
    attachLetter.form = attachLetterForm
/**
* @see \App\Http\Controllers\CaseController::detachLetter
 * @see app/Http/Controllers/CaseController.php:240
 * @route '/archives/{archive}/cases/{case}/detach-letter/{letter}'
 */
export const detachLetter = (args: { archive: number | { id: number }, case: number | { id: number }, letter: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number }, letter: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: detachLetter.url(args, options),
    method: 'delete',
})

detachLetter.definition = {
    methods: ["delete"],
    url: '/archives/{archive}/cases/{case}/detach-letter/{letter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CaseController::detachLetter
 * @see app/Http/Controllers/CaseController.php:240
 * @route '/archives/{archive}/cases/{case}/detach-letter/{letter}'
 */
detachLetter.url = (args: { archive: number | { id: number }, case: number | { id: number }, letter: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number }, letter: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    archive: args[0],
                    case: args[1],
                    letter: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archive: typeof args.archive === 'object'
                ? args.archive.id
                : args.archive,
                                case: typeof args.case === 'object'
                ? args.case.id
                : args.case,
                                letter: typeof args.letter === 'object'
                ? args.letter.id
                : args.letter,
                }

    return detachLetter.definition.url
            .replace('{archive}', parsedArgs.archive.toString())
            .replace('{case}', parsedArgs.case.toString())
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CaseController::detachLetter
 * @see app/Http/Controllers/CaseController.php:240
 * @route '/archives/{archive}/cases/{case}/detach-letter/{letter}'
 */
detachLetter.delete = (args: { archive: number | { id: number }, case: number | { id: number }, letter: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number }, letter: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: detachLetter.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CaseController::detachLetter
 * @see app/Http/Controllers/CaseController.php:240
 * @route '/archives/{archive}/cases/{case}/detach-letter/{letter}'
 */
    const detachLetterForm = (args: { archive: number | { id: number }, case: number | { id: number }, letter: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number }, letter: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: detachLetter.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CaseController::detachLetter
 * @see app/Http/Controllers/CaseController.php:240
 * @route '/archives/{archive}/cases/{case}/detach-letter/{letter}'
 */
        detachLetterForm.delete = (args: { archive: number | { id: number }, case: number | { id: number }, letter: number | { id: number } } | [archive: number | { id: number }, caseParam: number | { id: number }, letter: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: detachLetter.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    detachLetter.form = detachLetterForm
const CaseController = { index, create, store, show, edit, update, destroy, attachLetter, detachLetter }

export default CaseController