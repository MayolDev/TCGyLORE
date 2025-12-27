import UserController from './UserController'
import WorldController from './WorldController'
import StoryController from './StoryController'
import CharacterController from './CharacterController'
import LocationController from './LocationController'
import TimelineEventController from './TimelineEventController'
import CardController from './CardController'
import CardTypeController from './CardTypeController'
import RarityController from './RarityController'
import AlignmentController from './AlignmentController'
import ArchetypeController from './ArchetypeController'
import FactionController from './FactionController'
import EditionController from './EditionController'
import ArtistController from './ArtistController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
WorldController: Object.assign(WorldController, WorldController),
StoryController: Object.assign(StoryController, StoryController),
CharacterController: Object.assign(CharacterController, CharacterController),
LocationController: Object.assign(LocationController, LocationController),
TimelineEventController: Object.assign(TimelineEventController, TimelineEventController),
CardController: Object.assign(CardController, CardController),
CardTypeController: Object.assign(CardTypeController, CardTypeController),
RarityController: Object.assign(RarityController, RarityController),
AlignmentController: Object.assign(AlignmentController, AlignmentController),
ArchetypeController: Object.assign(ArchetypeController, ArchetypeController),
FactionController: Object.assign(FactionController, FactionController),
EditionController: Object.assign(EditionController, EditionController),
ArtistController: Object.assign(ArtistController, ArtistController),
}

export default Admin