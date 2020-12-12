import { AuthState } from '@aws-amplify/ui-components';

export enum MyAuthTypesEnum{
    UNAUTHENTICATED,
    GUEST
}

export type AuthTypesEnum = AuthState | MyAuthTypesEnum;