import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::index
 * @see app/Http/Controllers/ReportController.php:17
 * @route '/reports'
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
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
export const exportExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/reports/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
exportExcel.url = (options?: RouteQueryOptions) => {
    return exportExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
exportExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
exportExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
    const exportExcelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportExcel.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
        exportExcelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportExcel.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::exportExcel
 * @see app/Http/Controllers/ReportController.php:92
 * @route '/reports/export-excel'
 */
        exportExcelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportExcel.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportExcel.form = exportExcelForm
/**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/reports/export-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
exportPdf.url = (options?: RouteQueryOptions) => {
    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
exportPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
exportPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
    const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
        exportPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReportController::exportPdf
 * @see app/Http/Controllers/ReportController.php:109
 * @route '/reports/export-pdf'
 */
        exportPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdf.form = exportPdfForm
const ReportController = { index, exportExcel, exportPdf }

export default ReportController