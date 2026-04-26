import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/letters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::index
 * @see app/Http/Controllers/LetterController.php:36
 * @route '/letters'
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
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/letters/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::create
 * @see app/Http/Controllers/LetterController.php:159
 * @route '/letters/create'
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
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:219
 * @route '/letters'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/letters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:219
 * @route '/letters'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:219
 * @route '/letters'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:219
 * @route '/letters'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::store
 * @see app/Http/Controllers/LetterController.php:219
 * @route '/letters'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
export const show = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
show.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
show.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
show.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
    const showForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
        showForm.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::show
 * @see app/Http/Controllers/LetterController.php:246
 * @route '/letters/{letter}'
 */
        showForm.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
export const edit = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/letters/{letter}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
edit.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
edit.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
edit.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
    const editForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
        editForm.get = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::edit
 * @see app/Http/Controllers/LetterController.php:308
 * @route '/letters/{letter}/edit'
 */
        editForm.head = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
export const update = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
update.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
update.put = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
update.patch = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
    const updateForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
        updateForm.put = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\LetterController::update
 * @see app/Http/Controllers/LetterController.php:351
 * @route '/letters/{letter}'
 */
        updateForm.patch = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:394
 * @route '/letters/{letter}'
 */
export const destroy = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/letters/{letter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:394
 * @route '/letters/{letter}'
 */
destroy.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:394
 * @route '/letters/{letter}'
 */
destroy.delete = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:394
 * @route '/letters/{letter}'
 */
    const destroyForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::destroy
 * @see app/Http/Controllers/LetterController.php:394
 * @route '/letters/{letter}'
 */
        destroyForm.delete = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LetterController::publish
 * @see app/Http/Controllers/LetterController.php:411
 * @route '/letters/{letter}/publish'
 */
export const publish = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/letters/{letter}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LetterController::publish
 * @see app/Http/Controllers/LetterController.php:411
 * @route '/letters/{letter}/publish'
 */
publish.url = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{letter}', parsedArgs.letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::publish
 * @see app/Http/Controllers/LetterController.php:411
 * @route '/letters/{letter}/publish'
 */
publish.post = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LetterController::publish
 * @see app/Http/Controllers/LetterController.php:411
 * @route '/letters/{letter}/publish'
 */
    const publishForm = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LetterController::publish
 * @see app/Http/Controllers/LetterController.php:411
 * @route '/letters/{letter}/publish'
 */
        publishForm.post = (args: { letter: number | { id: number } } | [letter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, options),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
export const downloadAttachment = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAttachment.url(args, options),
    method: 'get',
})

downloadAttachment.definition = {
    methods: ["get","head"],
    url: '/attachments/{attachment}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
downloadAttachment.url = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attachment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { attachment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    attachment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return downloadAttachment.definition.url
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
downloadAttachment.get = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAttachment.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
downloadAttachment.head = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAttachment.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
    const downloadAttachmentForm = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadAttachment.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
        downloadAttachmentForm.get = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAttachment.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LetterController::downloadAttachment
 * @see app/Http/Controllers/LetterController.php:450
 * @route '/attachments/{attachment}/download'
 */
        downloadAttachmentForm.head = (args: { attachment: number | { id: number } } | [attachment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadAttachment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadAttachment.form = downloadAttachmentForm
const LetterController = { index, create, store, show, edit, update, destroy, publish, downloadAttachment }

export default LetterController