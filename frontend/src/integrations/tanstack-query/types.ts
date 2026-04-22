import type { UseMutationOptions } from "@tanstack/react-query";

export type ApiFnReturnType<TFunction extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<TFunction>
>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<TMutationFnType extends (...args: any) => Promise<any>> =
  UseMutationOptions<ApiFnReturnType<TMutationFnType>, Error, Parameters<TMutationFnType>[0]>;
