'use client'

import { CardWrapper } from './CardWrapper';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { NewPasswordSchema } from '@/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ErrorForm } from '../FormError';
import { SuccessForm } from '../FormSuccess';
import { useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/new-password';

const NewPasswordForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
          password: "",
          confirmPassword: ""
        }
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError('');
        // setSuccess('');

        startTransition(() => {
            newPassword(values, token)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                })
        })
    }

    return (
        <CardWrapper
            headerLabel='Enter a new password'
            backButtonLabel="Back to login"
            backButtonHref='/auth/login'
        >
            <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
            >   
                { !success &&
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                <Input disabled={isPending} {...field} placeholder='*********' type='password'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                <Input disabled={isPending} {...field} placeholder='*********' type='password'/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            )}
                        />
                    </div>
                }
                <SuccessForm message={success}/>
                <ErrorForm message={error}/>
                { !success && <Button disabled={isPending} type='submit' className='w-full'>Reset password</Button>}
            </form>
            </Form>
        </CardWrapper>
    )
}

export default NewPasswordForm