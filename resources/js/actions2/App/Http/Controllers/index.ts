import DashboardController from './DashboardController'
import OrganizationController from './OrganizationController'
import DepartmentController from './DepartmentController'
import PositionController from './PositionController'
import UserController from './UserController'
import LetterController from './LetterController'
import CartableController from './CartableController'
import RoutingController from './RoutingController'
import ArchiveController from './ArchiveController'
import CaseController from './CaseController'
import ReportController from './ReportController'
import LetterCategoryController from './LetterCategoryController'
import SettingController from './SettingController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
OrganizationController: Object.assign(OrganizationController, OrganizationController),
DepartmentController: Object.assign(DepartmentController, DepartmentController),
PositionController: Object.assign(PositionController, PositionController),
UserController: Object.assign(UserController, UserController),
LetterController: Object.assign(LetterController, LetterController),
CartableController: Object.assign(CartableController, CartableController),
RoutingController: Object.assign(RoutingController, RoutingController),
ArchiveController: Object.assign(ArchiveController, ArchiveController),
CaseController: Object.assign(CaseController, CaseController),
ReportController: Object.assign(ReportController, ReportController),
LetterCategoryController: Object.assign(LetterCategoryController, LetterCategoryController),
SettingController: Object.assign(SettingController, SettingController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers