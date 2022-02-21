 # compte rendu du projet infra

## **tables des matières**
* introduction du projet
* solution mise en place du projet
* Le Serveur virtuel OVH : 
* le nom de domaine 
* des protocoles 
* les fichier 


## **introduction du projet:**

Le projet est de proposer à des petites entreprises comme des pme, des solutions adapté à leurs besoin, dans le secteur du Web, à bas coût, et qui ne nécessite pas de gestion de leurs part.
une solution simple et sécurisé pour des pages web static, comme des vitrines de leur entreprise, comme leurs horaires d'ouverture ainsi que  leurs savoir faire.

### **solution mise en place du projet**

pour ce projet nous avons pris un serveur OVH être dans des conditions plus profetionnel et pour de meilleurs conditions de travail, ainsi que pour évitér d'éventuel problème de sous réseau avec le système du bridge de VM

dans ce but, nous avons aussi pris un nom de domène 
odipanemquidmeliora.tk

l'objectif est d'instaler plusieurs service Web sur une même machine, car les pages web seront static, en ne nécessiteront pas beaucoup d'interaction, et générant un nombre de visite adapté à la taille de l'entreprise, et demanderons moins de place, et de resource que d'autres pages web plus volumineuse et plus complexe, comme une boutique en ligne...
dans ce but, nous avons choisi apaches qui nous permet d'avoir plusieurs serveur Web, sur une même machine, et de pouvoir les mettre en place plus facilement.

puis pour la sécurité du server, et de ses services,
nous avons installé fail-to-ban pour bloquer et bannir les comportement suspicieux, ainsi que netdata pour connaître l'etat du serveur en temps  réel, et d'être informé en cas de problème, comme le stockage qu'il reste...

### **parties du projet**
* Le Serveur virtuel OVH : 
* nom de domaine : odipanemquidmeliora
* des protocoles : 
    1. apaches 
    2. fail to ban
    3. netdata
* un fichier main.go
* un fichier index.html
* un fichier style.css


### **apaches**
voici ci dessous les commandes d'apache : 

on télécharge et on lence les protocoles sshd et ssl
```
sudo dnf update
sudo dnf install httpd httpd-tools
sudo systemctl start httpd 
sudo systemctl enable httpd
sudo systemctl status httpd


sudo firewall-cmd --zone=public --add-port=80/tcp
sudo firewall-cmd --zone=public--add-port=443/tcp
sudo firewall-cmd --reload
http://164.132.56.166

#html de la page web

/var/www/html/index.html

#il est possible de rajouter des fichiers HTML a partir de /var/www/html/

sudo dnf install epel-release 
sudo dnf install certbot python3-certbot-apache mod_ssl
sudo certbot --apache -d odipanemquidmeliora.tk
```
on peut vérifier avec le nom de domaine 
https://odipanemquidmeliora.tk

La commande ci-dessus télécharge les certificats SSL
dans un sous-répertoire nommé d'après votre
domaine dans le répertoire /etc/letsencrypt/live.


```
sudo dnf install mod_ssl
sudo systemctl restart httpd
apachectl -M | grep ssl
ssl_module (shared)
sudo firewall-cmd --add-service={http,https} --permanent
sudo firewall-cmd --reload
```
si il y a un problem avec le certificat SSL il est possible d'en obtenir un avec ces commandes
```
SI IL NY A PAS DE CERTIFICATS SSL ( .CRT and .Key) DANS /etc/httpd/conf.d/ssl.conf
les rajouter

# pour les rajouter executer ces commandes 

sudo openssl req -newkey rsa:2048 -nodes -keyout /etc/pki/tls/private/server.key -x509 -days 365 -out /etc/pki/tls/certs/server.crt

SSLCertificateFile /etc/pki/tls/certs/server.crt
SSLCertificateKeyFile /etc/pki/tls/private/server.key

sudo nano /etc/httpd/conf.d/ssl.conf
SSLCertificateFile /etc/pki/tls/certs/localhost.crt
SSLCertificateKeyFile /etc/pki/tls/private/localhost.key

sudo systemctl reload httpd/
```

puis si tout est bon on arrive a la partie ports d'apaches, ou on declare les ports d'ecoute des serveurs web

```
sudo nano /etc/httpd/conf.d/redirect_http.conf
<VirtualHost _default_:80>
             Servername pierre-feuille-ciseau-lizard-spok
             Redirect permanent / https://odipanemquidmeliora.tk
</VirtualHost>

sudo systemctl reload httpd
```

### **fail to ban**
on as choisi fail to ban car oe protocole permet de bannir les requètes  Suspicieuses pouvant être malveillantes 

voici ci dessous les commandes de fail to ban :

on télécharge et on lence le package epel-release et le protocole fail2ban
```

sudo dnf install epel-release
sudo dnf install fail2ban fail2ban-firewalld
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
sudo systemctl status fail2ban

sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```
puis on configure fail to ban dans le fichier de configuration, pour sévir au bout de 20 essays et le temps de bannissement 

```
sudo nano /etc/fail2ban/jail.local
bantime = 1h
findtime = 1h
maxretry = 20
```
on deplace les fichiers de /etc/fail2ban/jail.d/00-firewalld.conf    à    /etc/fail2ban/jail.d/00-firewalld.local
```
sudo mv /etc/fail2ban/jail.d/00-firewalld.conf /etc/fail2ban/jail.d/00-firewalld.local
sudo systemctl restart fail2ban
```
```
sudo nano /etc/fail2ban/jail.d/sshd.local
[sshd]
enabled = true

# Override the default global configuration
# for specific jail sshd
bantime = 1d
maxretry = 20
```
on redemarre fail2ban pour appliquer les changements 
```
sudo systemctl restart fail2ban
sudo fail2ban-client status
'''
sudo fail2ban-client get sshd maxretry

20
'''

```
on ajoute les ip pour à ne pas banir pour ne pas être bannis
```
sudo fail2ban-client status sshd

sudo fail2ban-client unban 10.33.16.94
sudo fail2ban-client unban 10.33.16.68
sudo fail2ban-client unban 10.33.17.78

sudo fail2ban-client status sshd
```



### **net data**
voici ci dessous les commandes de net data :
on par commence l'instalation des packets de netdata 
puis on lence le service
```
dnf install epel-release -y

dnf install git libuuid-devel autoconf automake pkgconfig zlib-devel curl findutils libmnl gcc make -y
git clone https://github.com/netdata/netdata.git --depth=100

cd netdata
./packaging/installer/install-required-packages.sh --non-interactive --dont-wait netdata

dnf --enablerepo=powertools install libuv-devel
./netdata-installer.sh

systemctl start netdata
systemctl enable netdata
systemctl status netdata

firewall-cmd --permanent --add-port=19999/tcp
firewall-cmd --reload
```
vous pouvez tester l'etat actuel du serveur en suivant ce lien :

http://164.132.56.166:19999/

### **les fichiers**

Voici l'adresse du fichier main.go
***/var/www/golang/main.go***

les fichier index.html dans le dossier :
***/var/www/html/...***

les fichier style.css sont dans les fichiers :
***/var/www/css/style.css***

le fichier js est dans le ficher : 
/var/www/js/rules.js

### **utilisation du service**

on peut lencer un site de pierre feuille ciseau lézard spock qui est un exemple possible de page web, et qui est ébergé sur le serveur avec le nom de domaine suivant :
https://odipanemquidmeliora.tk

on peut tester l'etat du serveur avec :
http://164.132.56.166:19999/
  
  
