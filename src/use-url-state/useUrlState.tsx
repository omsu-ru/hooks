'use client';

/**
 * This hook, `useUrlState`, is designed to manage URL state in a Next.js application. It provides functionality to toggle, delete, and update URL parameters,
 * making it easier to handle URL-based state management for filters, search queries, or any other URL-driven state.
 *
 * @param {Object} [props] - Optional configuration object.
 * @param {Object} [props.initialFilter] - An object specifying the initial filter to apply. It should contain a `parameter` and a `key`.
 * @param {string} [props.type="single"] - Specifies the type of filter. Can be "single" for single-value filters or "multiple" for multi-value filters.
 *
 * @returns {Object} An object containing methods and state related to URL state management.
 * - `toggleUrlState(parameter: string, key: string)`: Toggles the presence of a key within a parameter. If the key is already present, it removes it; otherwise, it adds it.
 * - `deleteUrlState(parameter: string, key?: string)`: Deletes a key from a parameter. If no key is specified, it removes all keys from the parameter.
 * - `isActive(parameter: string, key: string)`: Checks if a key is active within a parameter.
 * - `state`: The current state of the URL parameters.
 * - `keys`: An array of all unique parameter keys.
 * - `updateUrl(params: URLSearchParams | ReadonlyURLSearchParams)`: Updates the URL with new parameters.
 * - `count`: The number of unique parameters.
 */
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  initialFilter?: { parameter: string; key: string };
  type?: 'single' | 'multiple';
};

type UrlState = {
  parameter: string;
  values: string[];
}[];

const createUrl = (pathname: string, params: URLSearchParams) => {
  const keys = [...params.keys()];
  const group = [...new Set(keys)].map((key) => ({
    facet: key,
    filters: params.getAll(key),
  }));

  const paramsString = group
    .map(({ facet, filters }) => `${facet}=${filters.join('%')}`)
    .join('&');

  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const useUrlState = ({
  type = 'single',
  initialFilter,
}: Partial<Props> = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const path = usePathname();
  const keys = [...new Set(params.keys())];
  const count = keys.length;

  const urlState = keys.map((key) => {
    return {
      parameter: key,
      values: params.getAll(key).toString().split('%').slice(1),
    };
  });

  const [state, setState] = useState<UrlState>();

  const deleteUrlState = (parameter: string, key?: string) => {
    const filtered = params
      .getAll(parameter)
      .toString()
      .split('%')
      .filter((value) => key !== value)
      .join('%');

    if (filtered.length < 1 || !key) {
      params.delete(parameter);
    } else {
      params.set(parameter, filtered);
    }

    router.replace(createUrl(path, params), { scroll: false });
  };

  const toggleUrlState = (parameter: string, key: string) => {
    if (isActive(parameter, key)) {
      deleteUrlState(parameter, key);
      return;
    }

    if (type === 'multiple') {
      params.append(parameter, key);
    } else {
      params.set(parameter, key);
    }

    router.replace(createUrl(path, params), { scroll: false });
  };

  const updateUrl = (params: URLSearchParams | ReadonlyURLSearchParams) => {
    router.replace(createUrl(path, params), { scroll: false });
  };

  useEffect(() => {
    if (initialFilter) {
      toggleUrlState(initialFilter.parameter, initialFilter.key);
    }
    setState(urlState);
  }, [searchParams]);

  const isActive = (parameter: string, key: string) =>
    params.getAll(parameter).toString().includes(key);

  return {
    toggleUrlState,
    deleteUrlState,
    isActive,
    state,
    keys,
    updateUrl,
    count,
  };
};
