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
const admin = {
    users: Object.assign(users, users),
editorImages: Object.assign(editorImages, editorImages),
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