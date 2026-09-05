import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
import editorImages from './editor-images'
import worlds from './worlds'
import stories from './stories'
import characters from './characters'
import locations from './locations'
import timelineEvents from './timeline-events'
import cards from './cards'
import tallerCards from './taller-cards'
import decks from './decks'
import manualSections from './manual-sections'
import cardTypes from './card-types'
import rarities from './rarities'
import alignments from './alignments'
import archetypes from './archetypes'
import factions from './factions'
import editions from './editions'
import artists from './artists'
/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/admin/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:29
 * @route '/admin/buscar'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const admin = {
    users: Object.assign(users, users),
editorImages: Object.assign(editorImages, editorImages),
search: Object.assign(search, search),
worlds: Object.assign(worlds, worlds),
stories: Object.assign(stories, stories),
characters: Object.assign(characters, characters),
locations: Object.assign(locations, locations),
timelineEvents: Object.assign(timelineEvents, timelineEvents),
cards: Object.assign(cards, cards),
tallerCards: Object.assign(tallerCards, tallerCards),
decks: Object.assign(decks, decks),
manualSections: Object.assign(manualSections, manualSections),
cardTypes: Object.assign(cardTypes, cardTypes),
rarities: Object.assign(rarities, rarities),
alignments: Object.assign(alignments, alignments),
archetypes: Object.assign(archetypes, archetypes),
factions: Object.assign(factions, factions),
editions: Object.assign(editions, editions),
artists: Object.assign(artists, artists),
}

export default admin