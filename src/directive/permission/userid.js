import store from '@/store';

function checkPermission(el, binding) {
    const { value } = binding;
    const roles = store.getters && store.getters.uidentity;
    const list = value.split(',');
    if (!list.includes(roles)) {
        el.parentNode && el.parentNode.removeChild(el);
    }
}

export default {
    inserted(el, binding) {
        checkPermission(el, binding);
    },
    update(el, binding) {
        checkPermission(el, binding);
    },
};
