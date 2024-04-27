"use client";

import { verification } from '@/actions/verification';
import { CardWrapper } from '@/components/auth/CardWrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { SuccessForm } from '../FormSuccess';
import { ErrorForm } from '../FormError';

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
 
    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing token!");
            return;
        }

        verification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!")
            })
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper 
            headerLabel='Confirming your verification'
            backButtonHref='/auth/login'
            backButtonLabel='Back to login'
        >
            <div className='flex items-center justify-center w-full'>
                { (!success && !error) && <BeatLoader/> }
                <SuccessForm message={success}/>
                <ErrorForm message={error}/>
            </div>
        </CardWrapper>
    )
}