import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';

import { authenticator } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';

export async function loader({ request }: ActionFunctionArgs) {
  const info = await authenticator.authenticate('oidc', request);

  if (!info) {
    throw redirect('/auth/login');
  }

  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  session.set('info', info);
  const commit = await sessionStorage.commitSession(session);

  throw redirect('/', {
    headers: { 'Set-Cookie': commit },
  });
}
