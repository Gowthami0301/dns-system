const express = require('express');
const { getAllDomains, createDomain, deleteDomain, updateDomain } = require('../controllers/domainsController');
const { authenticateUser } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: API endpoints for managing domains
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Domain:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         resourceRecordSetCount:
 *           type: integer
 *         dnsRecords:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DnsRecord'
 *       required:
 *         - id
 *         - name
 *         - resourceRecordSetCount
 *         - dnsRecords
 *     
 *     DnsRecord:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         value:
 *           type: string
 *       required:
 *         - type
 *         - value
 * 
 *     NewDomain:
 *       type: object
 *       properties:
 *         domainName:
 *           type: string
 *         dnsRecords:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DnsRecord'
 *       required:
 *         - domainName
 *         - dnsRecords
 * 
 *     UpdateDomain:
 *       type: object
 *       properties:
 *         newName:
 *           type: string
 *         newDnsRecords:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DnsRecord'
 *       required:
 *         - newName
 */

/**
 * @swagger
 * /domains:
 *   get:
 *     summary: Get all domains
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of domains
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Domain'
 *
 *   post:
 *     summary: Create a new domain
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDomain'
 *     responses:
 *       '201':
 *         description: Successfully created domain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domain'
 *
 * /domains/{domainId}:
 *   delete:
 *     summary: Delete a domain by ID
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: domainId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the domain to delete
 *     responses:
 *       '204':
 *         description: Successfully deleted domain
 *
 *   put:
 *     summary: Update the name of a domain
 *     tags: [Domains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: domainId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the domain to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDomain'
 *     responses:
 *       '200':
 *         description: Successfully updated domain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domain'
 */

router.get('/', authenticateUser, getAllDomains);
router.post('/', authenticateUser, createDomain);
router.delete('/:domainId', authenticateUser, deleteDomain);
router.put('/:domainId', authenticateUser, updateDomain);

module.exports = router;
