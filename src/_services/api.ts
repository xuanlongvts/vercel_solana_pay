import ENV, { getConfig, envName } from '_config';
import API from '.';

const singleton = Symbol('key for first');
const singletonEnforcer = Symbol('key for assign');

const ProviderApi = (detectEnv = ENV, headersConfig = null, restParams = {}) => {
    class SolanaConfig extends API {
        constructor(enforcer: typeof singletonEnforcer) {
            if (enforcer !== singletonEnforcer) {
                throw new Error('Cannot construct singleton');
            }
            super(getConfig(detectEnv ?? envName.dev), headersConfig, restParams);
        }

        static get getInstance() {
            if (!(this as any)[singleton]) {
                (this as any)[singleton] = new SolanaConfig(singletonEnforcer);
            }

            return (this as any)[singleton];
        }
    }

    return SolanaConfig.getInstance;
};

export default ProviderApi;
