
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';

export type AuraAidCircuitId = 'createCampaign' | 'donate';

const debugFetch: typeof fetch = async (input, init) => {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  console.log('[ZK FETCH]', url);

  const response = await fetch(input, {
    ...init,
    cache: 'no-store',
  });

  console.log(
    '[ZK RESPONSE]',
    url,
    'status:',
    response.status,
    'content-length:',
    response.headers.get('content-length'),
    'content-type:',
    response.headers.get('content-type'),
  );

  if (!response.ok) {
    throw new Error(
      `ZK asset HTTP ${response.status}: ${url}`,
    );
  }

  return response;
};

export const auraAidZkConfig =
  new FetchZkConfigProvider<AuraAidCircuitId>(
    window.location.origin,
    debugFetch,
  );
