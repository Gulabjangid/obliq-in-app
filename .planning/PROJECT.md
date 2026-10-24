# Project Context: OBLIQ-in

## Executive Summary

**OBLIQ-in** is a high-security, multi-tenant digital workspace tailored for Chartered Accountant (CA) firms, tax preparers, and their business clients in India. It bridges client document submission, internal firm preparation, hierarchical review, and invoice/challan OCR extraction.

## Core Problem & Value Proposition

- **The Problem**: CA firms handle thousands of loose invoices, GST challans, Bank Statements, and tax notices via unorganized channels (WhatsApp, email, pendrives). Article assistants spend hundreds of billable hours manually typing entries into spreadsheets or accounting software, resulting in reconciliation errors, missing tax credits (ITC), and audit friction.
- **The Solution**: A unified firm portal and controlled client upload workspace that ingests financial documents, runs OCR field extraction with confidence scores and source coordinate bounding boxes, and enables streamlined review workflows with end-to-end multi-tenant data isolation and audit trails.

## Target Personas

1. **Firm Owner / Managing Partner (CA)**:
   - Sets up firm profile, invites article assistants and reviewers, assigns engagements, monitors billing/unbilled hours, and signs off on final audits.
2. **Reviewer / Senior Consultant**:
   - Reviews work completed by article assistants, flags discrepancies, and approves engagement deliverables.
3. **Article Assistant / Preparer**:
   - Logs daily billable time per engagement, uploads and validates document metadata, reconciles proposed revenue register fields.
4. **Client Upload User**:
   - Submits bills, invoices, receipts, and bank statements directly to their firm's portal without having visibility into other clients' records or internal firm discussions.

## Key Technical Invariants & Constraints

- **Strict Multi-Tenancy**: Data separation enforced at the database level by binding every resource to `firm_id` extracted exclusively from the authenticated session.
- **Data Privacy & Compliance**: Zero persistence of real taxpayer identifiers (PAN, GSTIN, bank numbers) in git history or logs; strict adherence to Indian compliance rules.
- **Vanilla CSS Aesthetics**: Clean, state-of-the-art dashboard following Figma specifications without relying on CSS utility classes or heavy component libraries.
- **Lightweight Testability**: Pure Node.js native test runner (`node:test`) for instant feedback; isolated disposable PostgreSQL for integration testing.
