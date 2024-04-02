import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ url, request }) => {
		const { pathname } = url;

		const data = await request.formData();
		const bracketSize = data.get('bracketSize');

		if (!bracketSize || bracketSize === 'undefined' || bracketSize instanceof File) {
			return fail(400, { missing: true });
		}

		// TODO create bracket in db then redirect to bracket page

		return redirect(303, `${pathname}/bracket/${bracketSize}`);
	}
} satisfies Actions;
