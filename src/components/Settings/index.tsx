import Copy from '@mui/icons-material/ContentCopy';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import FetchProvider, { useFetchContext } from '../../context/Fetch';
import i18n from '../../i18n';
import Providers from '../../Providers';
import Description from '../Description';
import Loader from '../Loader';
import { CopiedMessageContent, CopiedMessageWrapper, TextFieldStyles } from './styles';
import { IProps } from './types';

const Settings: React.FC<IProps> = () => {
	const { t } = useTranslation('settings');
	const theme = useTheme();
	const { key, regenerateSecretKey, loadingRegenerate, loading } = useFetchContext();
	const [justCopied, setJustCopied] = useState<boolean>(false);

	const copy = () => {
		navigator.clipboard.writeText(key);

		setJustCopied(true);
		setTimeout(() => {
			setJustCopied(false);
		}, 500);
	};

	if (loading)
		return (
			<Box
				sx={{
					height: '500px',
				}}
			>
				<Loader size={100} />
			</Box>
		);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'flex-start',
				padding: '10px 50px',
			}}
		>
			<Typography
				sx={{
					fontSize: '16px',
					fontWeight: '800',
					color: theme.palette.text.primary,
				}}
			>
				{t('secretKey')}:
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					gap: '8px',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<TextFieldStyles
					disabled
					fullWidth
					sx={{
						color: theme.palette.text.disabled,
						'& .MuiOutlinedInput-notchedOutline': {
							borderStyle: 'dashed',
						},
					}}
					value={key}
				/>
				<Tooltip arrow placement="top" title={t('replicate')}>
					<IconButton className="icn" onClick={copy}>
						<Copy fontSize="small" />
						<CopiedMessageWrapper
							className={justCopied && 'active-copied-message'}
							sx={{ position: 'absolute', bottom: -30, right: i18n.language === 'uk_dev' || i18n.language === 'uk' ? -25 : -10 }}
						>
							<CopiedMessageContent>
								<Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 11 }}>{t('copied')}</Typography>
							</CopiedMessageContent>
						</CopiedMessageWrapper>
					</IconButton>
				</Tooltip>
				<LoadingButton
					fullWidth
					loading={loadingRegenerate}
					onClick={regenerateSecretKey}
					size="large"
					type="submit"
					variant="contained"
					sx={{
						background: theme.palette.primary.main,
						border: `1px solid ${theme.palette.primary.main}`,
						textTransform: 'initial',
						borderRadius: '5px',
						padding: '5px 7px',
						width: '200px',

						'& .MuiLoadingButton-loadingIndicator': {
							color: theme.palette.primary.main,
						},
					}}
				>
					{t('regenerate')}
				</LoadingButton>
			</Box>
			<Description />
		</Box>
	);
};

const SettingsWrap: React.FC<IProps> = ({ userSettings }) => {
	useEffect(() => {
		i18n.changeLanguage(userSettings?.lang);
	}, [userSettings?.lang]);

	return (
		<React.Suspense>
			<I18nextProvider i18n={i18n}>
				<Providers userSettings={userSettings}>
					<FetchProvider>
						<Settings />
					</FetchProvider>
				</Providers>
			</I18nextProvider>
		</React.Suspense>
	);
};

export default SettingsWrap;
