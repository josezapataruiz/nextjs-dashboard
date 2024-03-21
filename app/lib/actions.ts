'use server';

import { revalidatePath } from 'next/cache';
import { createMySQLPool } from './db-connection';
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const amount = Number(formData.get('amount'));
  const customerId = formData.get('customerId');
  const status = formData.get('status');
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await createMySQLPool.query(
    `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (?,?,?,?)
    `,
    [customerId, amountInCents, status, date],
  );

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const amount = Number(formData.get('amount'));
  const customerId = formData.get('customerId');
  const status = formData.get('status');
  const amountInCents = amount * 100;

  await createMySQLPool.query(
    `
          UPDATE invoices
          SET customer_id = ?, amount = ?, status = ?
          WHERE id = ?
      `,
    [customerId, amountInCents, status, id],
  );

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await createMySQLPool.query(`DELETE FROM invoices WHERE id = ?`, [id]);
  revalidatePath('/dashboard/invoices');
}
