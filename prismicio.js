import { createClient as baseCreateClient } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import prismicConfig from "./prismic.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName = prismicConfig.repositoryName;

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param {import("@prismicio/client").ClientConfig} config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
	const client = baseCreateClient(repositoryName, {
		routes: prismicConfig.routes,
		fetchOptions:
			process.env.NODE_ENV === 'production'
				? { next: { tags: ['prismic'] }, cache: 'force-cache' }
				: { next: { revalidate: 5 } },
		...config,
	});

	enableAutoPreviews({ client });

	return client;
};