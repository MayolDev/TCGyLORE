import users from './users'
import worlds from './worlds'
import stories from './stories'
import characters from './characters'
import locations from './locations'
import timelineEvents from './timeline-events'
import cards from './cards'
const admin = {
    users: Object.assign(users, users),
worlds: Object.assign(worlds, worlds),
stories: Object.assign(stories, stories),
characters: Object.assign(characters, characters),
locations: Object.assign(locations, locations),
timelineEvents: Object.assign(timelineEvents, timelineEvents),
cards: Object.assign(cards, cards),
}

export default admin