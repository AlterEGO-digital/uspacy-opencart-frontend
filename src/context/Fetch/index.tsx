import React, { createContext, useContext, useEffect, useState } from 'react';

import { isDev, isStage } from '../../helpers';
import { getToken } from '../../helpers/db';
import { useErrorNotification } from '../../hooks/useErrorNotification';

interface IProps {
	children: React.ReactNode;
}
interface IFetchContext {
	getSecretKey(): void;
	regenerateSecretKey(): void;
	key: string;
	loadingRegenerate: boolean;
	loading: boolean;
}

export interface ISecretKey {
	id: number;
	status: boolean;
	message: string;
	key: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Fetch: any = createContext({});
export const useFetchContext = () => useContext<IFetchContext>(Fetch);

const FetchProvider: React.FC<IProps> = ({ children }) => {
	const [key, setKey] = useState('');
	const [loading, setLoading] = useState(true);
	const [loadingRegenerate, setLoadingRegenerate] = useState(false);
	const OPENCART_API = `https://${isDev || isStage ? 'appopencart-uspacy.alterego.biz.ua' : 'appopencart-uspacy.alterego.digital'}/opencart/v1`;
	const { errorNotification } = useErrorNotification();

	const getSecretKey = async () => {
		setLoading(true);
		try {
			const token = await getToken();
			const res = await fetch(`${OPENCART_API}/keys/getKey`, {
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			});
			const data: ISecretKey = await res.json();
			setKey(data?.key || '');
		} catch (e) {
			errorNotification();
		} finally {
			setLoading(false);
		}
	};

	const regenerateSecretKey = async () => {
		setLoadingRegenerate(true);
		try {
			const token = await getToken();
			const res = await fetch(`${OPENCART_API}/keys/regenerateKey`, {
				method: 'POST',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			});
			const data: ISecretKey = await res.json();
			setKey(data?.key || '');
		} catch (e) {
			errorNotification();
		} finally {
			setLoadingRegenerate(false);
		}
	};

	useEffect(() => {
		getSecretKey();
	}, []);

	return (
		<Fetch.Provider
			value={{
				getSecretKey,
				regenerateSecretKey,
				key,
				loadingRegenerate,
				loading,
			}}
		>
			{children}
		</Fetch.Provider>
	);
};

export default FetchProvider;
