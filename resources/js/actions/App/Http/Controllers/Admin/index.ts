import UserController from './UserController'
import WorldController from './WorldController'
import StoryController from './StoryController'
import CharacterController from './CharacterController'
import LocationController from './LocationController'
import TimelineEventController from './TimelineEventController'
import CardController from './CardController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
WorldController: Object.assign(WorldController, WorldController),
StoryController: Object.assign(StoryController, StoryController),
CharacterController: Object.assign(CharacterController, CharacterController),
LocationController: Object.assign(LocationController, LocationController),
TimelineEventController: Object.assign(TimelineEventController, TimelineEventController),
CardController: Object.assign(CardController, CardController),
}

export default Admin