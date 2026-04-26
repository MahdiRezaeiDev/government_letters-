import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cartable',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CartableController::index
 * @see app/Http/Controllers/CartableController.php:16
 * @route '/cartable'
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
* @see \App\Http\Controllers\CartableController::complete
 * @see app/Http/Controllers/CartableController.php:153
 * @route '/cartable/{routing}/complete'
 */
export const complete = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/cartable/{routing}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartableController::complete
 * @see app/Http/Controllers/CartableController.php:153
 * @route '/cartable/{routing}/complete'
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
* @see \App\Http\Controllers\CartableController::complete
 * @see app/Http/Controllers/CartableController.php:153
 * @route '/cartable/{routing}/complete'
 */
complete.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CartableController::complete
 * @see app/Http/Controllers/CartableController.php:153
 * @route '/cartable/{routing}/complete'
 */
    const completeForm = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: complete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CartableController::complete
 * @see app/Http/Controllers/CartableController.php:153
 * @route '/cartable/{routing}/complete'
 */
        completeForm.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: complete.url(args, options),
            method: 'post',
        })
    
    complete.form = completeForm
/**
* @see \App\Http\Controllers\CartableController::reject
 * @see app/Http/Controllers/CartableController.php:203
 * @route '/cartable/{routing}/reject'
 */
export const reject = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/cartable/{routing}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartableController::reject
 * @see app/Http/Controllers/CartableController.php:203
 * @route '/cartable/{routing}/reject'
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
* @see \App\Http\Controllers\CartableController::reject
 * @see app/Http/Controllers/CartableController.php:203
 * @route '/cartable/{routing}/reject'
 */
reject.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CartableController::reject
 * @see app/Http/Controllers/CartableController.php:203
 * @route '/cartable/{routing}/reject'
 */
    const rejectForm = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CartableController::reject
 * @see app/Http/Controllers/CartableController.php:203
 * @route '/cartable/{routing}/reject'
 */
        rejectForm.post = (args: { routing: number | { id: number } } | [routing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const CartableController = { index, complete, reject }

export default CartableController