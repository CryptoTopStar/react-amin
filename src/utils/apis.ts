import Instance from './axios';
class APIs {
    static getBanner(params: any) {
        return Instance.get('https://jsonplaceholder.typicode.com/todos/1', {
            params,
        });
    }
    static adminLogin(data: any) {
        return Instance.post('/admin/login', data);
    }
    static adminLoginMobile(data: any) {
        return Instance.post('/admin/login_mobile_code', data);
    }
    static adminLogout(data: any) {
        return Instance.post('/admin/logout', data);
    }
    static getAdminInfo(data: any) {
        return Instance.post('/admin/get_admin_info', data);
    }
    static adminList(data: any) {
        return Instance.post('/admin/get_list', data);
    }
    static adminAdd(data: any) {
        return Instance.post('/admin/add', data);
    }
    static adminModify(data: any) {
        return Instance.post('/admin/modify', data);
    }
    static adminRemove(data: any) {
        return Instance.post('/admin/remove', data);
    }
    static adminModifyPassword(data: any) {
        return Instance.post('/admin/modify_password', data);
    }
    static adminModifyLogout(data: any) {
        return Instance.post('/admin/logout', data);
    }
    static roleAllList(data: any) {
        return Instance.post('/role/get_all_list', data);
    }
    static getPermissionRoleVillage(data: any) {
        return Instance.post('/admin/get_permission_role_village', data);
    }
    static modifyUserPermission(data: any) {
        return Instance.post('/admin/modify_user_permission', data);
    }
    static platIntegrationlist(data: any) {
        return Instance.post('/platform_integration/get_list', data);
    }

    static platIntegrationgetPlatformIntegList(data: any) {
        return Instance.post(
            '/platform_integration/get_platform_integration_list',
            data,
        );
    }
    static platIntegrationgetPlatformInteAdd(data: any) {
        return Instance.post('/platform_integration/add', data);
    }
    static platBackGetPublicKeyList(data: any) {
        return Instance.post('/platform_background/get_public_key_list', data);
    }
    static platBackAdd(data: any) {
        return Instance.post('/platform_background/add', data);
    }
    static platBackModify(data: any) {
        return Instance.post('/platform_background/modify', data);
    }
    static platIntegrationModify(data: any) {
        return Instance.post('/platform_integration/modify', data);
    }
    static platIntegrationRemove(data: any) {
        return Instance.post('/platform_integration/remove', data);
    }
    static platBgRemove(data: any) {
        return Instance.post('/platform_background/remove', data);
    }

    static platInteBacklist(data: any) {
        return Instance.post('/platform_background/get_list', data);
    }
    static sendSms(data: any) {
        return Instance.post('/sms/send', data);
    }
    static uploadImages(data: any) {
        return Instance.post('/upload/upload_images', data);
    }
    static homePlatformIntegrationList(data: any) {
        return Instance.post(
            '/index/get_index_platform_integration_list',
            data,
        );
    }
    static platformBackgroundList(data: any) {
        return Instance.post('/platform_background/get_list', data);
    }
}
interface APIs {}
export default APIs;
