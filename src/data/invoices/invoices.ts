import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"

export const getAllInvoices = async ({ limit = 10, offset = 0, search = '' }: { limit?: number, offset?: number, search?: string }) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const CHANNELS = [
        { name: 'Safaricom M-PESA', number: '1234567890' },
        { name: 'KCB Bank', number: '0987654321' },
        { name: 'Equity Bank', number: '1122334455' },
        { name: 'Airtel Money', number: '5566778899' },
        { name: 'Absa Bank', number: '6677889900' },
        { name: 'Co-operative Bank', number: '7788990011' }
    ]

    const MERCHANTS = [
        { name: 'Tech Solutions Ltd', ref: 'TSL' },
        { name: 'Creative Agency', ref: 'CA' },
        { name: 'Marketing Experts', ref: 'ME' },
        { name: 'Content Creators Inc', ref: 'CCI' },
        { name: 'App Innovators', ref: 'AI' },
        { name: 'Cloud Solutions Ltd', ref: 'CSL' },
        { name: 'Tech Support Co', ref: 'TSC' }
    ]

    const ITEMS = [
        'Parking Fees',
        'Business License Renewal',
        'Office Supplies',
        'Utilities (Electricity)',
        'Office Rent',
        'Internet & Telecommunications',
        'Equipment Maintenance',
        'Insurance Premium',
        'Vehicle Maintenance',
        'Professional Consulting',
        'Staff Training',
        'Hotel Accommodation',
        'Business Travel Expenses',
        'Marketing Materials',
        'Stationery Supplies',
        'Office Furniture',
        'Waste Management',
        'Security Services',
        'Building Maintenance',
        'Legal & Compliance Fees'
    ]

    const NAMES = ['John Mwangi', 'Stephen Otieno', 'Alex Kimutai', 'Joseph Kamau', 'Benard Kioko', 'Jane Wambui', 'Mary Achieng', 'David Ochieng', 'Grace Njeri', 'Michael Mwangi', 'Emily Davis', 'Alice Johnson', 'Bob Williams', 'Charlie Brown']

    const totalInvoices = 50
    const invoices = Array.from({ length: totalInvoices }, (_, index) => {
        const channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)]
        const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)]
        const amountDue = (Math.floor(Math.random() * 5000) + 100).toFixed(2)
        const status = ['PENDING', 'PAID', 'OVERDUE'][Math.floor(Math.random() * 3)]
        const amountPaid = status === 'PAID' ? amountDue : status === 'OVERDUE' ? '0.00' : (Math.floor(Math.random() * parseFloat(amountDue))).toFixed(2)
        const payerName = NAMES[Math.floor(Math.random() * NAMES.length)]

        return {
            id: `INV-${String(index + 1).padStart(3, '0')}`,
            number: `INV-${String(index + 1).padStart(3, '0')}`,
            item_name: ITEMS[Math.floor(Math.random() * ITEMS.length)],
            merchant_name: merchant.name,
            merchant_reference: `${merchant.ref}-2024-${String(index + 1).padStart(3, '0')}`,
            channel_name: channel.name,
            channel_number: channel.number,
            amount_due: amountDue,
            amount_paid: amountPaid,
            status: status,
            created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            payer: {
                name: payerName,
                email: `${payerName.toLowerCase().replace(' ', '.')}@example.com`,
                phone_number: `0712345${String(index + 1).padStart(3, '0')}`
            }
        }
    })

    const filteredInvoices = search
        ? invoices.filter(invoice =>
            invoice.number.toLowerCase().includes(search.toLowerCase()) ||
            invoice.item_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.channel_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.email.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.phone_number.toLowerCase().includes(search.toLowerCase())
        )
        : invoices

    // Paginate results
    const paginatedInvoices = filteredInvoices.slice(offset, offset + limit)

    return {
        count: filteredInvoices.length,
        results: paginatedInvoices
    }
}

export const getInvoiceStats = async () => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
        date: new Date().toISOString(),
        total: {
            count: 50,
            amount_due: '125000.00',
            amount_paid: '75000.00',
            currency: 'KES'
        },
        by_status: {
            pending: {
                count: 15,
                amount_due: '30000.00',
                amount_paid: '10000.00'
            },
            paid: {
                count: 25,
                amount_due: '65000.00',
                amount_paid: '65000.00'
            },
            partial: {
                count: 5,
                amount_due: '15000.00',
                amount_paid: '5000.00'
            },
            cancelled: {
                count: 5,
                amount_due: '15000.00',
                amount_paid: '0.00'
            }
        }
    }
}


export const getMockInvoices = async ({ limit = 10, offset = 0, search = '' }: { limit?: number, offset?: number, search?: string }) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    const invoices = [
        {
            id: "INV-001",
            number: "INV-001",
            item_name: "Parking Fees",
            merchant_name: "Tech Solutions Ltd",
            merchant_reference: "TSL-2024-001",
            channel_name: "Safaricom M-PESA",
            channel_number: "1234567890",
            amount_due: "1500.00",
            amount_paid: "500.00",
            status: "PENDING",
            created_at: "2024-01-01T10:00:00Z",
            payer: {
                name: "John Doe",
                email: "john.doe@example.com",
                phone_number: "0712345678"
            }
        },
        {
            id: "INV-002",
            number: "INV-002",
            item_name: "Business License Renewal",
            merchant_name: "Creative Agency",
            merchant_reference: "CA-2024-002",
            channel_name: "KCB Bank",
            channel_number: "0987654321",
            amount_due: "2000.00",
            amount_paid: "2000.00",
            status: "PAID",
            created_at: "2024-01-02T11:30:00Z",
            payer: {
                name: "Jane Smith",
                email: "jane.smith@example.com",
                phone_number: "0712345679"
            }
        },
        {
            id: "INV-003",
            number: "INV-003",
            item_name: "Office Supplies",
            merchant_name: "Marketing Experts",
            merchant_reference: "ME-2024-003",
            channel_name: "Equity Bank",
            channel_number: "1122334455",
            amount_due: "1200.00",
            amount_paid: "0.00",
            status: "OVERDUE",
            created_at: "2024-01-03T09:15:00Z",
            payer: {
                name: "Alice Johnson",
                email: "alice.johnson@example.com",
                phone_number: "0712345680"
            }
        },
        {
            id: "INV-004",
            number: "INV-004",
            item_name: "Utilities (Electricity)",
            merchant_name: "Content Creators Inc",
            merchant_reference: "CCI-2024-004",
            channel_name: "Airtel Money",
            channel_number: "5566778899",
            amount_due: "800.00",
            amount_paid: "800.00",
            status: "PAID",
            created_at: "2024-01-04T14:45:00Z",
            payer: {
                name: "Bob Williams",
                email: "bob.williams@example.com",
                phone_number: "0712345681"
            }
        },
        {
            id: "INV-005",
            number: "INV-005",
            item_name: "Office Rent",
            merchant_name: "App Innovators",
            merchant_reference: "AI-2024-005",
            channel_name: "Absa Bank",
            channel_number: "6677889900",
            amount_due: "5000.00",
            amount_paid: "2500.00",
            status: "PENDING",
            created_at: "2024-01-05T16:20:00Z",
            payer: {
                name: "Charlie Brown",
                email: "charlie.brown@example.com",
                phone_number: "0712345682"
            }
        },
        {
            id: "INV-006",
            number: "INV-006",
            item_name: "Insurance Premium",
            merchant_name: "Tech Support Co",
            merchant_reference: "TSC-2024-006",
            channel_name: "Safaricom M-PESA",
            channel_number: "1234567890",
            amount_due: "300.00",
            amount_paid: "0.00",
            status: "OVERDUE",
            created_at: "2024-01-06T08:00:00Z",
            payer: {
                name: "David Lee",
                email: "david.lee@example.com",
                phone_number: "0712345683"
            }
        },
        {
            id: "INV-007",
            number: "INV-007",
            item_name: "Business Travel Expenses",
            merchant_name: "Cloud Solutions Ltd",
            merchant_reference: "CSL-2024-007",
            channel_name: "KCB Bank",
            channel_number: "0987654321",
            amount_due: "1000.00",
            amount_paid: "1000.00",
            status: "PAID",
            created_at: "2024-01-07T12:30:00Z",
            payer: {
                name: "Emily Davis",
                email: "emily.davis@example.com",
                phone_number: "0712345684"
            }
        }
    ]
    const filteredInvoices = search
        ? invoices.filter(invoice =>
            invoice.number.toLowerCase().includes(search.toLowerCase()) ||
            invoice.item_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.channel_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.email.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.phone_number.toLowerCase().includes(search.toLowerCase())
        )
        : invoices

    // Paginate results
    const paginatedInvoices = filteredInvoices.slice(offset, offset + limit)

    return {
        count: filteredInvoices.length,
        results: paginatedInvoices
    }
}

export const getPaidInvoices = async ({ limit = 10, offset = 0, search = '' }: { limit?: number, offset?: number, search?: string }) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const allInvoices = await getMockInvoices({ limit: 100, offset: 0, search: '' })
    const paidInvoices = allInvoices.results.filter(invoice => invoice.status === 'PAID')

    const filteredInvoices = search
        ? paidInvoices.filter(invoice =>
            invoice.number.toLowerCase().includes(search.toLowerCase()) ||
            invoice.item_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.channel_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.email.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.phone_number.toLowerCase().includes(search.toLowerCase())
        )
        : paidInvoices

    // Paginate results
    const paginatedInvoices = filteredInvoices.slice(offset, offset + limit)

    return {
        count: filteredInvoices.length,
        results: paginatedInvoices
    }
}

export const getVoidedInvoices = async ({ limit = 10, offset = 0, search = '' }: { limit?: number, offset?: number, search?: string }) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const CHANNELS = [
        { name: 'Safaricom M-PESA', number: '1234567890' },
        { name: 'KCB Bank', number: '0987654321' },
        { name: 'Equity Bank', number: '1122334455' },
        { name: 'Airtel Money', number: '5566778899' },
        { name: 'Absa Bank', number: '6677889900' },
        { name: 'Co-operative Bank', number: '7788990011' }
    ]

    const MERCHANTS = [
        { name: 'Tech Solutions Ltd', ref: 'TSL' },
        { name: 'Creative Agency', ref: 'CA' },
        { name: 'Marketing Experts', ref: 'ME' },
        { name: 'Content Creators Inc', ref: 'CCI' },
        { name: 'App Innovators', ref: 'AI' },
        { name: 'Cloud Solutions Ltd', ref: 'CSL' },
        { name: 'Tech Support Co', ref: 'TSC' }
    ]

    const ITEMS = [
        'Parking Fees',
        'Business License Renewal',
        'Office Supplies',
        'Utilities (Electricity)',
        'Office Rent',
        'Internet & Telecommunications',
        'Equipment Maintenance',
        'Insurance Premium',
        'Vehicle Maintenance',
        'Professional Consulting',
        'Staff Training',
        'Hotel Accommodation',
        'Business Travel Expenses',
        'Marketing Materials',
        'Stationery Supplies',
        'Office Furniture',
        'Waste Management',
        'Security Services',
        'Building Maintenance',
        'Legal & Compliance Fees'
    ]

    const NAMES = ['John Mwangi', 'Stephen Otieno', 'Alex Kimutai', 'Joseph Kamau', 'Benard Kioko', 'Jane Wambui', 'Mary Achieng', 'David Ochieng', 'Grace Njeri', 'Michael Mwangi', 'Emily Davis', 'Alice Johnson', 'Bob Williams', 'Charlie Brown']

    const VOID_REASONS = [
        'Customer requested cancellation',
        'Duplicate invoice',
        'Incorrect amount',
        'Service not delivered',
        'Payment dispute',
        'Merchant request',
        'System error correction',
        'Refund processed',
        'Contract terminated',
        'Billing error'
    ]

    const totalInvoices = 50
    const invoices = Array.from({ length: totalInvoices }, (_, index) => {
        const channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)]
        const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)]
        const amountDue = (Math.floor(Math.random() * 5000) + 100).toFixed(2)
        const payerName = NAMES[Math.floor(Math.random() * NAMES.length)]
        const voidReason = VOID_REASONS[Math.floor(Math.random() * VOID_REASONS.length)]

        return {
            id: `VOID-INV-${String(index + 1).padStart(3, '0')}`,
            number: `VOID-INV-${String(index + 1).padStart(3, '0')}`,
            item_name: ITEMS[Math.floor(Math.random() * ITEMS.length)],
            merchant_name: merchant.name,
            merchant_reference: `${merchant.ref}-2024-${String(index + 1).padStart(3, '0')}`,
            channel_name: channel.name,
            channel_number: channel.number,
            amount_due: amountDue,
            amount_paid: '0.00',
            status: 'VOIDED',
            void_reason: voidReason,
            voided_at: new Date(Date.now() - Math.floor(Math.random() * 500000000)).toISOString(),
            created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
            payer: {
                name: payerName,
                email: `${payerName.toLowerCase().replace(' ', '.')}@example.com`,
                phone_number: `0712345${String(index + 1).padStart(3, '0')}`
            }
        }
    })

    const filteredInvoices = search
        ? invoices.filter(invoice =>
            invoice.number.toLowerCase().includes(search.toLowerCase()) ||
            invoice.item_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.channel_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.email.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.phone_number.toLowerCase().includes(search.toLowerCase()) ||
            invoice.void_reason.toLowerCase().includes(search.toLowerCase())
        )
        : invoices

    // Paginate results
    const paginatedInvoices = filteredInvoices.slice(offset, offset + limit)

    return {
        count: filteredInvoices.length,
        results: paginatedInvoices
    }
}

export const getVoidedInvoiceStats = async () => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
        date: new Date().toISOString(),
        total: {
            count: 50,
            amount_due: '87500.00',
            amount_paid: '0.00',
            currency: 'KES'
        },
        by_status: {
            pending: {
                count: 0,
                amount_due: '0.00',
                amount_paid: '0.00'
            },
            paid: {
                count: 0,
                amount_due: '0.00',
                amount_paid: '0.00'
            },
            partial: {
                count: 0,
                amount_due: '0.00',
                amount_paid: '0.00'
            },
            cancelled: {
                count: 50,
                amount_due: '87500.00',
                amount_paid: '0.00'
            }
        }
    }
}

export const getArchivedInvoices = async ({ limit = 10, offset = 0, search = '' }: { limit?: number, offset?: number, search?: string }) => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const CHANNELS = [
        { name: 'Safaricom M-PESA', number: '1234567890' },
        { name: 'KCB Bank', number: '0987654321' },
        { name: 'Equity Bank', number: '1122334455' },
        { name: 'Airtel Money', number: '5566778899' },
        { name: 'Absa Bank', number: '6677889900' },
        { name: 'Co-operative Bank', number: '7788990011' }
    ]

    const MERCHANTS = [
        { name: 'Tech Solutions Ltd', ref: 'TSL' },
        { name: 'Creative Agency', ref: 'CA' },
        { name: 'Marketing Experts', ref: 'ME' },
        { name: 'Content Creators Inc', ref: 'CCI' },
        { name: 'App Innovators', ref: 'AI' },
        { name: 'Cloud Solutions Ltd', ref: 'CSL' },
        { name: 'Tech Support Co', ref: 'TSC' }
    ]

    const ITEMS = [
        'Parking Fees',
        'Business License Renewal',
        'Office Supplies',
        'Utilities (Electricity)',
        'Office Rent',
        'Internet & Telecommunications',
        'Equipment Maintenance',
        'Insurance Premium',
        'Vehicle Maintenance',
        'Professional Consulting',
        'Staff Training',
        'Hotel Accommodation',
        'Business Travel Expenses',
        'Marketing Materials',
        'Stationery Supplies',
        'Office Furniture',
        'Waste Management',
        'Security Services',
        'Building Maintenance',
        'Legal & Compliance Fees'
    ]

    const NAMES = ['John Mwangi', 'Stephen Otieno', 'Alex Kimutai', 'Joseph Kamau', 'Benard Kioko', 'Jane Wambui', 'Mary Achieng', 'David Ochieng', 'Grace Njeri', 'Michael Mwangi', 'Emily Davis', 'Alice Johnson', 'Bob Williams', 'Charlie Brown']

    const totalInvoices = 50
    const invoices = Array.from({ length: totalInvoices }, (_, index) => {
        const channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)]
        const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)]
        const amountDue = (Math.floor(Math.random() * 5000) + 100).toFixed(2)
        const status = ['PAID', 'SETTLED'][Math.floor(Math.random() * 2)]
        const payerName = NAMES[Math.floor(Math.random() * NAMES.length)]

        return {
            id: `ARCH-INV-${String(index + 1).padStart(3, '0')}`,
            number: `ARCH-INV-${String(index + 1).padStart(3, '0')}`,
            item_name: ITEMS[Math.floor(Math.random() * ITEMS.length)],
            merchant_name: merchant.name,
            merchant_reference: `${merchant.ref}-2023-${String(index + 1).padStart(3, '0')}`,
            channel_name: channel.name,
            channel_number: channel.number,
            amount_due: amountDue,
            amount_paid: amountDue,
            status: status,
            archived: true,
            archived_at: new Date(Date.now() - Math.floor(Math.random() * 500000000) - 31536000000).toISOString(),
            created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000) - 31536000000).toISOString(),
            payer: {
                name: payerName,
                email: `${payerName.toLowerCase().replace(' ', '.')}@example.com`,
                phone_number: `0712345${String(index + 1).padStart(3, '0')}`
            }
        }
    })

    const filteredInvoices = search
        ? invoices.filter(invoice =>
            invoice.number.toLowerCase().includes(search.toLowerCase()) ||
            invoice.item_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.channel_name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.name.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.email.toLowerCase().includes(search.toLowerCase()) ||
            invoice.payer.phone_number.toLowerCase().includes(search.toLowerCase())
        )
        : invoices

    // Paginate results
    const paginatedInvoices = filteredInvoices.slice(offset, offset + limit)

    return {
        count: filteredInvoices.length,
        results: paginatedInvoices
    }
}

export const getArchivedInvoiceStats = async () => {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
        date: new Date().toISOString(),
        total: {
            count: 50,
            amount_due: '112500.00',
            amount_paid: '112500.00',
            currency: 'KES'
        },
        by_status: {
            pending: {
                count: 0,
                amount_due: '0.00',
                amount_paid: '0.00'
            },
            paid: {
                count: 35,
                amount_due: '78750.00',
                amount_paid: '78750.00'
            },
            partial: {
                count: 0,
                amount_due: '0.00',
                amount_paid: '0.00'
            },
            cancelled: {
                count: 15,
                amount_due: '33750.00',
                amount_paid: '33750.00'
            }
        }
    }
}