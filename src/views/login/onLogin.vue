<template>
    <div></div>
</template>
<script>
import { getToken } from '@/utils/auth';

export default {
    mounted() {
        const token = this.$route.query.token;
        const code = this.$route.query.code;
        console.log('创建mounted', token, code);
        if (token && code) {
            parent.postMessage({ type: 'canary_login', code, token }, '*');
        }
    },
};
</script>
