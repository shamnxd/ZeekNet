import 'reflect-metadata';
import { Container } from 'inversify';

import { registerCoreDi } from 'src/infrastructure/di/register-core-di';
import { registerAuthDi } from 'src/infrastructure/di/register-auth-di';
import { registerChatDi } from 'src/infrastructure/di/register-chat-di';
import { registerSeekerDi } from 'src/infrastructure/di/register-seeker-di';
import { registerAtsDi } from 'src/infrastructure/di/register-ats-di';
import { registerAdminDi } from 'src/infrastructure/di/register-admin-di';
import { registerNotificationDi } from 'src/infrastructure/di/register-notification-di';
import { registerPublicDi } from 'src/infrastructure/di/register-public-di';
import { registerCompanyDi } from 'src/infrastructure/di/register-company-di';

const container = new Container();

registerCoreDi(container);
registerAuthDi(container);
registerChatDi(container);
registerSeekerDi(container);
registerAtsDi(container);
registerAdminDi(container);
registerNotificationDi(container);
registerPublicDi(container);
registerCompanyDi(container);

export { container };
