import ChronicleController from './ChronicleController'
import RulebookController from './RulebookController'
import DashboardController from './DashboardController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    ChronicleController: Object.assign(ChronicleController, ChronicleController),
RulebookController: Object.assign(RulebookController, RulebookController),
DashboardController: Object.assign(DashboardController, DashboardController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers