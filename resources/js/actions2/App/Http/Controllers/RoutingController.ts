import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
export const create = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}/routing/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
create.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { letter: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: typeof args.letter === 'object'
                ? args.letter.id
                : args.letter,
                }

    return create.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
create.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
create.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
    const createForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
        createForm.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoutingController::create
 * @see app/Http/Controllers/RoutingController.php:109
 * @route '/letters/{letter}/routing/create'
 */
        createForm.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RoutingController::store
 * @see app/Http/Controllers/RoutingController.php:142
 * @route '/letters/{letter}/routing'
 */
export const store = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/letters/{letter}/routing',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoutingController::store
 * @see app/Http/Controllers/RoutingController.php:142
 * @route '/letters/{letter}/routing'
 */
store.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { letter: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: typeof args.letter === 'object'
                ? args.letter.id
                : args.letter,
                }

    return store.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoutingController::store
 * @see app/Http/Controllers/RoutingController.php:142
 * @route '/letters/{letter}/routing'
 */
store.post = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoutingController::store
 * @see app/Http/Controllers/RoutingController.php:142
 * @route '/letters/{letter}/routing'
 */
    const storeForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoutingController::store
 * @see app/Http/Controllers/RoutingController.php:142
 * @route '/letters/{letter}/routing'
 */
        storeForm.post = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RoutingController::complete
 * @see app/Http/Controllers/RoutingController.php:225
 * @route '/routings/{routing}/complete'
 */
export const complete = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/routings/{routing}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoutingController::complete
 * @see app/Http/Controllers/RoutingController.php:225
 * @route '/routings/{routing}/complete'
 */
complete.url = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { routing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { routing: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    routing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        routing: typeof args.routing === 'object'
                ? args.routing.id
                : args.routing,
                }

    return complete.definition.url
            .replace('{routing}', parsedArgs.routing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoutingController::complete
 * @see app/Http/Controllers/RoutingController.php:225
 * @route '/routings/{routing}/complete'
 */
complete.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoutingController::complete
 * @see app/Http/Controllers/RoutingController.php:225
 * @route '/routings/{routing}/complete'
 */
    const completeForm = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoutingController::complete
 * @see app/Http/Controllers/RoutingController.php:225
 * @route '/routings/{routing}/complete'
 */
        completeForm.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
/**
* @see \App\Http\Controllers\RoutingController::reject
 * @see app/Http/Controllers/RoutingController.php:301
 * @route '/routings/{routing}/reject'
 */
export const reject = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/routings/{routing}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RoutingController::reject
 * @see app/Http/Controllers/RoutingController.php:301
 * @route '/routings/{routing}/reject'
 */
reject.url = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { routing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { routing: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    routing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        routing: typeof args.routing === 'object'
                ? args.routing.id
                : args.routing,
                }

    return reject.definition.url
            .replace('{routing}', parsedArgs.routing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoutingController::reject
 * @see app/Http/Controllers/RoutingController.php:301
 * @route '/routings/{routing}/reject'
 */
reject.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RoutingController::reject
 * @see app/Http/Controllers/RoutingController.php:301
 * @route '/routings/{routing}/reject'
 */
    const rejectForm = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RoutingController::reject
 * @see app/Http/Controllers/RoutingController.php:301
 * @route '/routings/{routing}/reject'
 */
        rejectForm.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
export const history = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(args, options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}/routings-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
history.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { letter: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { letter: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        letter: typeof args.letter === 'object'
                ? args.letter.id
                : args.letter,
                }

    return history.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
history.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
history.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
    const historyForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
        historyForm.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RoutingController::history
 * @see app/Http/Controllers/RoutingController.php:363
 * @route '/letters/{letter}/routings-history'
 */
        historyForm.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
const RoutingController = { create, store, complete, reject, history }

export default RoutingController