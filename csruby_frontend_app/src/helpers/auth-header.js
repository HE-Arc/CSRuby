import { authenticationService } from '@/_services';

export function authHeader() {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: 'Token ${currentUser.token}' };
    } else {
        return {};
    }
}
